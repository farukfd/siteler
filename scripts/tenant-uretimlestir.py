#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""TENANT SEO ÜRETİMLEŞTİRİCİ — dağıtılmış (veya kopyalanmış) bir tenant docroot'unu
DEMO'dan ÜRETİM SEO durumuna geçirir. uretim-paketle.py yalnız danisman/insaat paketler;
gayrimenkul şablonundan açılan müşteri siteleri (ör. 10lineemlak.com) bu adımdan
geçmediği için canlıda noindex + 'Disallow: /' + yanlış-host sitemap ile kalıyordu.
Bu betik sunucudaki docroot üzerinde YERİNDE çalışır (markalama/içeriğe dokunmaz).

  python3 scripts/tenant-uretimlestir.py --docroot /var/www/10lineemlak --host 10lineemlak.com
  python3 scripts/tenant-uretimlestir.py --docroot dist/deneme --host ornek.com --dry-run

Dönüşümler:
  1. HTML: DEMO robots satırı ('noindex,nofollow,noarchive' + yorumu) SÖKÜLÜR.
     Bilinçli sayfa-bazlı 'noindex,follow' (özel portföy, stub sayfalar) KORUNUR.
  2. HTML: robots meta'sız kalan sayfaya üretim satırı eklenir
     (index,follow,max-image-preview:large); çift/eski üretim satırı normalize edilir.
     Hata sayfaları (404.html, 410.html, 50x.html) her koşulda noindex kalır.
  3. HTML: title'daki ' (DEMO)' eki ve 'CANLI DEMO' bandı (demo-band section) sökülür.
  4. HTML/XML/TXT: demo host referansları tenant hostuna çevrilir
     (www.emlakekspertizi.com/demo/<şablon> ve <şablon>.emlakekspertizi.com → <host>).
  5. HTML: canonical / og:url tenant hostunda ama hedef dosya docroot'ta YOKSA sayfanın
     kendi URL'sine çevrilir (soft-404'e işaret eden canonical = sayfa dizinden düşer).
  6. robots.txt: üretim değeri (Allow: / + varsa Disallow: /admin-assets/ + Sitemap satırı).
  7. sitemap.xml: host düzeltme + index.html → / + DEMO yorumu temizliği; sayfası noindex
     olan veya docroot'ta DOSYASI OLMAYAN girişler düşer; kök dizindeki indekslenebilir
     ama sitemap'te olmayan sayfalar eklenir (dinamik rotalar için --sitemap-dosyasiz-koru).
  8. SON-TARAMA: kalan DEMO noindex / demo-host kalıntısı / dosyasız canonical bulunursa
     çıkış kodu 1 (uretim-paketle.py leakage disipliniyle aynı: kanıtsız PASS yok).

İdempotent: ikinci koşuda hiçbir dosya değişmez. Python 3.6+ (sunucu: 3.6.8).
"""
import re, os, sys, argparse

DEMO_ROBOTS = re.compile(r'<meta name="robots" content="noindex,nofollow,noarchive">\s*(?:<!--[^>]*-->)?\s*\n?')
URETIM_META = '<meta name="robots" content="index,follow,max-image-preview:large">'
HATA_META = '<meta name="robots" content="noindex">'
HERHANGI_ROBOTS = re.compile(r'<meta name="robots" content="[^"]*"[^>]*>')
DEMO_BAND = re.compile(r'<section class="demo-band"[\s\S]*?</section>\s*')
TITLE_DEMO = re.compile(r'<title>([^<]*?)\s*\((?:DEMO|Demosu)\)\s*</title>')
CANONICAL = re.compile(r'(<link rel="canonical" href=")([^"]+)(")')
OG_URL = re.compile(r'(<meta property="og:url" content=")([^"]+)(")')
SITEMAP_URL = re.compile(r'\s*<url>\s*<loc>([^<]+)</loc>[\s\S]*?</url>')
HATA_SAYFASI = re.compile(r'^(404|410|50\d)\.html$')

LOG = []
def log(msg): LOG.append(msg)

def oku(p):
    with open(p, encoding='utf-8') as f: return f.read()

def yaz(p, s):
    with open(p, 'w', encoding='utf-8') as f: f.write(s)

def host_cevir(s, sablon, host):
    s = s.replace('https://www.emlakekspertizi.com/demo/{}/'.format(sablon), 'https://{}/'.format(host))
    s = s.replace('https://www.emlakekspertizi.com/demo/{}'.format(sablon),  'https://{}'.format(host))
    s = s.replace('https://www.emlakekspertizi.com/{}/'.format(sablon), 'https://{}/'.format(host))
    s = s.replace('https://www.emlakekspertizi.com/{}'.format(sablon),  'https://{}'.format(host))
    s = s.replace('https://{}.emlakekspertizi.com'.format(sablon), 'https://{}'.format(host))
    return s

def url_to_rel(url, host):
    """Tenant hostundaki URL → docroot'a göreli dosya yolu; başka host ise None."""
    m = re.match(r'^https?://' + re.escape(host) + r'(/[^?#]*)?', url)
    if not m: return None
    yol = (m.group(1) or '/').lstrip('/')
    if yol == '' or yol.endswith('/'): yol += 'index.html'
    return yol

def rel_to_url(rel, host):
    rel = rel.replace(os.sep, '/')
    if rel == 'index.html': return 'https://{}/'.format(host)
    if rel.endswith('/index.html'): return 'https://{}/{}/'.format(host, rel[:-len('index.html')].rstrip('/'))
    return 'https://{}/{}'.format(host, rel)

def dosya_var(docroot, rel):
    return rel is not None and os.path.isfile(os.path.join(docroot, rel))

def html_donustur(s, sablon, host, rel, docroot):
    s = host_cevir(s, sablon, host)
    # 1) DEMO robots satırı (+ açıklama yorumu) sökülür — 'noindex,follow' sayfa kararları korunur
    s = DEMO_ROBOTS.sub('', s)
    # 2) eski üretim satırı normalize (uretim-paketle.py ile aynı hedef değer)
    s = s.replace('<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><!-- üretim tenant -->', URETIM_META)
    s = s.replace('<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">', URETIM_META)
    if HATA_SAYFASI.match(os.path.basename(rel)):
        # hata sayfası hiçbir koşulda indekslenmez (HTTP 404 dönse de meta tutarlı kalsın)
        if HERHANGI_ROBOTS.search(s):
            if not re.search(r'<meta name="robots" content="noindex', s):
                s = HERHANGI_ROBOTS.sub(HATA_META, s, count=1); log('hata sayfası noindex: ' + rel)
        elif '<head>' in s:
            s = s.replace('<head>', '<head>\n' + HATA_META, 1); log('hata sayfası noindex: ' + rel)
    elif not HERHANGI_ROBOTS.search(s) and '<head>' in s:
        # robots meta'sız kalan sayfaya üretim satırı (canlı 10line kopyasında üretim satırı hiç yoktu)
        s = s.replace('<head>', '<head>\n' + URETIM_META, 1)
    # 3) dürüstlük eklerinin üretimde yeri yok: title (DEMO) eki + CANLI DEMO bandı
    s = TITLE_DEMO.sub(r'<title>\1</title>', s)
    s = DEMO_BAND.sub('', s)
    # 5) canonical / og:url hedefi docroot'ta yoksa (soft-404'e işaret) → sayfanın kendisi
    kendi = rel_to_url(rel, host)
    def onar(etiket):
        def f(m):
            hedef_rel = url_to_rel(m.group(2), host)
            if hedef_rel is None or dosya_var(docroot, hedef_rel): return m.group(0)
            log('{} dosyasız hedef {} → {} ({})'.format(etiket, m.group(2), kendi, rel))
            return m.group(1) + kendi + m.group(3)
        return f
    s = CANONICAL.sub(onar('canonical'), s)
    s = OG_URL.sub(onar('og:url'), s)
    return s

def _sayfa_icerigi(docroot, rel, sayfalar):
    if rel is None: return None
    if rel in sayfalar: return sayfalar[rel]
    tam = os.path.join(docroot, rel)
    return oku(tam) if os.path.isfile(tam) else None

def _indekslenebilir(icerik):
    return icerik is not None and not re.search(r'<meta name="robots" content="noindex', icerik)

def sitemap_donustur(s, sablon, host, docroot, sayfalar, dosyasiz_koru):
    s = host_cevir(s, sablon, host)
    s = re.sub(r'\s*<!--[^>]*DEMO[^>]*-->', '', s)
    s = s.replace('https://{}/index.html'.format(host), 'https://{}/'.format(host))
    mevcut = set()
    # Sitemap'te yalnız indekslenebilir + gerçekten var olan URL'ler: noindex stub'ları
    # (/ozel/ vb.) ve dosyası olmayan girişler (soft-404 ile ana sayfayı döndüren kalıntılar) düşer.
    def ele(m):
        loc = m.group(1).strip()
        rel = url_to_rel(loc, host)
        icerik = _sayfa_icerigi(docroot, rel, sayfalar)
        if rel is not None and icerik is None and not dosyasiz_koru:
            log('sitemap: dosyasız giriş düştü ' + loc); return ''
        if icerik is not None and not _indekslenebilir(icerik):
            log('sitemap: noindex giriş düştü ' + loc); return ''
        mevcut.add(rel); return m.group(0)
    s = SITEMAP_URL.sub(ele, s)
    # Kök dizindeki indekslenebilir sayfalar sitemap'te yoksa eklenir (bolge.html vakası)
    ek = []
    for ad in sorted(os.listdir(docroot)):
        if not ad.endswith('.html') or ad in mevcut or HATA_SAYFASI.match(ad): continue
        if not _indekslenebilir(_sayfa_icerigi(docroot, ad, sayfalar)): continue
        ek.append('  <url><loc>{}</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>\n'.format(rel_to_url(ad, host)))
        log('sitemap: eksik sayfa eklendi ' + rel_to_url(ad, host))
    if ek and '</urlset>' in s:
        s = s.replace('</urlset>', ''.join(ek) + '</urlset>')
    return s

def uretim_robots_txt(host, admin_var):
    satirlar = ['User-agent: *', 'Allow: /']
    if admin_var: satirlar.append('Disallow: /admin-assets/')
    satirlar += ['', 'Sitemap: https://{}/sitemap.xml'.format(host), '']
    return '\n'.join(satirlar)

def son_tarama(docroot, host):
    """Üretim docroot'unda kalmaması gerekenler. Bulgu listesi döner (boş = TEMİZ)."""
    bulgular = []
    for kok, _, adlar in os.walk(docroot):
        for ad in adlar:
            if not ad.endswith(('.html', '.xml', '.txt')): continue
            yol = os.path.join(kok, ad)
            rel = os.path.relpath(yol, docroot)
            s = oku(yol)
            if ad.endswith('.html') and 'noindex,nofollow,noarchive' in s:
                bulgular.append((rel, 'DEMO noindex kalıntısı'))
            if ad.endswith('.html'):
                for m in CANONICAL.finditer(s):
                    hr = url_to_rel(m.group(2), host)
                    if hr is not None and not dosya_var(docroot, hr):
                        bulgular.append((rel, 'canonical dosyasız hedefe işaret ediyor: ' + m.group(2)))
            if 'emlakekspertizi.com/demo/' in s:
                bulgular.append((rel, 'demo host kalıntısı (emlakekspertizi.com/demo/)'))
            if ad == 'robots.txt' and re.search(r'^Disallow:\s*/\s*$', s, re.M):
                bulgular.append((rel, "robots.txt hâlâ 'Disallow: /'"))
    return bulgular

def main():
    ap = argparse.ArgumentParser(description='Tenant docroot DEMO→ÜRETİM SEO geçişi (yerinde, idempotent)')
    ap.add_argument('--docroot', required=True, help='Tenant sitesinin kök dizini (ör. /var/www/10lineemlak)')
    ap.add_argument('--host', required=True, help='Tenant alan adı (ör. 10lineemlak.com — şema/eğik çizgi olmadan)')
    ap.add_argument('--sablon', default='gayrimenkul', help='Kaynak şablon adı (demo host çevirisi için; vars: gayrimenkul)')
    ap.add_argument('--sitemap-dosyasiz-koru', action='store_true', help='Docroot\'ta dosyası olmayan sitemap girişlerini koru (nginx ile dinamik rotalar varsa)')
    ap.add_argument('--dry-run', action='store_true', help='Yazma; yalnız değişecek dosyaları raporla')
    a = ap.parse_args()
    host = a.host.strip().lower().rstrip('/')
    host = re.sub(r'^https?://', '', host)
    if not os.path.isdir(a.docroot):
        print('✗ docroot bulunamadı: ' + a.docroot); return 2

    dosyalar = [os.path.join(kok, ad) for kok, _, adlar in os.walk(a.docroot) for ad in adlar]
    # Sitemap budaması sayfaların SON hâline bakar → HTML'ler ilk geçişte, sitemap ikinci geçişte
    dosyalar.sort(key=lambda p: (os.path.basename(p) == 'sitemap.xml', p))
    degisen, incelenen, sayfalar = [], 0, {}
    for yol in dosyalar:
        ad = os.path.basename(yol)
        rel = os.path.relpath(yol, a.docroot).replace(os.sep, '/')
        if ad.endswith('.html'):
            once = oku(yol); sonra = html_donustur(once, a.sablon, host, rel, a.docroot); sayfalar[rel] = sonra
        elif ad == 'sitemap.xml':
            once = oku(yol); sonra = sitemap_donustur(once, a.sablon, host, a.docroot, sayfalar, a.sitemap_dosyasiz_koru)
        elif ad == 'robots.txt':
            once = oku(yol)
            sonra = uretim_robots_txt(host, os.path.isdir(os.path.join(a.docroot, 'admin-assets')))
        elif ad in ('llms.txt', 'humans.txt') or ad.endswith('.xml'):
            once = oku(yol); sonra = host_cevir(once, a.sablon, host)
        else:
            continue
        incelenen += 1
        if sonra != once:
            degisen.append(rel)
            if not a.dry_run: yaz(yol, sonra)

    on_ek = '[KURU KOŞU] ' if a.dry_run else ''
    print('{}{} dosya incelendi, {} dosya {}:'.format(on_ek, incelenen, len(degisen), 'değişecek' if a.dry_run else 'güncellendi'))
    for r in sorted(degisen): print('  · ' + r)
    if LOG:
        print('\nÖzel kararlar:')
        for m in LOG: print('  ! ' + m)

    if a.dry_run:
        print('\nKuru koşu — son-tarama yazılmış dosyalar üzerinde anlamlıdır; gerçek koşuda uygulanır.')
        return 0
    bulgular = son_tarama(a.docroot, host)
    if bulgular:
        print('\n✗ SON-TARAMA — {} bulgu (docroot ÜRETİME HAZIR DEĞİL):'.format(len(bulgular)))
        for rel, ne in bulgular: print('  {} ← {}'.format(rel, ne))
        return 1
    print('\n✓ son-tarama TEMİZ — https://{}/ üretim SEO durumunda.'.format(host))
    print('  Hatırlatma: Search Console\'da property doğrula + sitemap gönder; edge/CDN önbelleğini temizle.')
    return 0

if __name__ == '__main__':
    sys.exit(main())
