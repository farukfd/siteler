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
  3. HTML: title'daki ' (DEMO)' eki ve 'CANLI DEMO' bandı (demo-band section) sökülür.
  4. HTML/XML/TXT: demo host referansları tenant hostuna çevrilir
     (www.emlakekspertizi.com/demo/<şablon> ve <şablon>.emlakekspertizi.com → <host>).
  5. robots.txt: üretim değeri (Allow: / + varsa Disallow: /admin-assets/ + Sitemap satırı).
  6. sitemap.xml: host düzeltme + index.html → / + DEMO yorumu temizliği + sayfası
     noindex olan girişler (hash-overlay stub'ları) sitemap'ten düşürülür.
  7. SON-TARAMA: kalan DEMO noindex / demo-host kalıntısı bulunursa çıkış kodu 1
     (uretim-paketle.py leakage disipliniyle aynı: kanıtsız PASS yok).

İdempotent: ikinci koşuda hiçbir dosya değişmez.
"""
import re, os, sys, argparse

DEMO_ROBOTS = re.compile(r'<meta name="robots" content="noindex,nofollow,noarchive">\s*(?:<!--[^>]*-->)?\s*\n?')
URETIM_META = '<meta name="robots" content="index,follow,max-image-preview:large">'
HERHANGI_ROBOTS = re.compile(r'<meta name="robots" content="[^"]*"')
DEMO_BAND = re.compile(r'<section class="demo-band"[\s\S]*?</section>\s*')
TITLE_DEMO = re.compile(r'<title>([^<]*?)\s*\((?:DEMO|Demosu)\)\s*</title>')

def oku(p):
    with open(p, encoding='utf-8') as f: return f.read()

def yaz(p, s):
    with open(p, 'w', encoding='utf-8') as f: f.write(s)

def host_cevir(s, sablon, host):
    s = s.replace(f'https://www.emlakekspertizi.com/demo/{sablon}/', f'https://{host}/')
    s = s.replace(f'https://www.emlakekspertizi.com/demo/{sablon}', f'https://{host}')
    s = s.replace(f'https://www.emlakekspertizi.com/{sablon}/', f'https://{host}/')
    s = s.replace(f'https://www.emlakekspertizi.com/{sablon}',  f'https://{host}')
    s = s.replace(f'https://{sablon}.emlakekspertizi.com', f'https://{host}')
    return s

def html_donustur(s, sablon, host):
    s = host_cevir(s, sablon, host)
    # 1) DEMO robots satırı (+ açıklama yorumu) sökülür — 'noindex,follow' sayfa kararları korunur
    s = DEMO_ROBOTS.sub('', s)
    # 2) eski üretim satırı normalize (uretim-paketle.py ile aynı hedef değer)
    s = s.replace('<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><!-- üretim tenant -->', URETIM_META)
    s = s.replace('<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">', URETIM_META)
    # robots meta'sız kalan sayfaya üretim satırı (canlı 10line kopyasında üretim satırı hiç yoktu)
    if not HERHANGI_ROBOTS.search(s) and '<head>' in s:
        s = s.replace('<head>', '<head>\n' + URETIM_META, 1)
    # 3) dürüstlük eklerinin üretimde yeri yok: title (DEMO) eki + CANLI DEMO bandı
    s = TITLE_DEMO.sub(r'<title>\1</title>', s)
    s = DEMO_BAND.sub('', s)
    return s

SITEMAP_URL = re.compile(r'\s*<url>\s*<loc>([^<]+)</loc>[\s\S]*?</url>')

def _sayfa_icerigi(docroot, loc, host, sayfalar):
    """Sitemap loc'unun sayfa içeriği: dönüştürülmüş bellek kopyası (kuru koşuda da doğru),
    yoksa disk; eşleşen dosya yoksa None."""
    yol = re.sub(r'^https?://' + re.escape(host), '', loc).split('?')[0].split('#')[0].lstrip('/')
    if yol == '' or yol.endswith('/'): yol += 'index.html'
    if yol in sayfalar: return sayfalar[yol]
    tam = os.path.join(docroot, yol)
    return oku(tam) if os.path.isfile(tam) else None

def sitemap_donustur(s, sablon, host, docroot, sayfalar):
    s = host_cevir(s, sablon, host)
    s = re.sub(r'\s*<!--[^>]*DEMO[^>]*-->', '', s)
    s = s.replace(f'https://{host}/index.html', f'https://{host}/')
    # Sitemap'te yalnız indekslenebilir URL: sayfası noindex olan girişler (hash-overlay
    # stub'ları: /ozel/, /sat/, … canonical'ı üst dizine işaret eder) sitemap'ten düşer.
    def ele(m):
        icerik = _sayfa_icerigi(docroot, m.group(1), host, sayfalar)
        if icerik is not None and re.search(r'<meta name="robots" content="noindex', icerik):
            return ''
        return m.group(0)
    return SITEMAP_URL.sub(ele, s)

def uretim_robots_txt(host, admin_var):
    satirlar = ['User-agent: *', 'Allow: /']
    if admin_var: satirlar.append('Disallow: /admin-assets/')
    satirlar += ['', f'Sitemap: https://{host}/sitemap.xml', '']
    return '\n'.join(satirlar)

def son_tarama(docroot):
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
    ap.add_argument('--dry-run', action='store_true', help='Yazma; yalnız değişecek dosyaları raporla')
    a = ap.parse_args()
    host = a.host.strip().lower().rstrip('/')
    host = re.sub(r'^https?://', '', host)
    if not os.path.isdir(a.docroot):
        print(f'✗ docroot bulunamadı: {a.docroot}'); return 2

    dosyalar = [os.path.join(kok, ad) for kok, _, adlar in os.walk(a.docroot) for ad in adlar]
    # Sitemap budaması sayfaların SON hâline bakar → HTML'ler ilk geçişte, sitemap ikinci geçişte
    dosyalar.sort(key=lambda p: (os.path.basename(p) == 'sitemap.xml', p))
    degisen, incelenen, sayfalar = [], 0, {}
    for yol in dosyalar:
        ad = os.path.basename(yol)
        rel = os.path.relpath(yol, a.docroot).replace(os.sep, '/')
        if ad.endswith('.html'):
            once = oku(yol); sonra = html_donustur(once, a.sablon, host); sayfalar[rel] = sonra
        elif ad == 'sitemap.xml':
            once = oku(yol); sonra = sitemap_donustur(once, a.sablon, host, a.docroot, sayfalar)
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
    print(f'{on_ek}{incelenen} dosya incelendi, {len(degisen)} dosya {"değişecek" if a.dry_run else "güncellendi"}:')
    for r in sorted(degisen): print(f'  · {r}')

    if a.dry_run:
        print('\nKuru koşu — son-tarama yazılmış dosyalar üzerinde anlamlıdır; gerçek koşuda uygulanır.')
        return 0
    bulgular = son_tarama(a.docroot)
    if bulgular:
        print(f'\n✗ SON-TARAMA — {len(bulgular)} bulgu (docroot ÜRETİME HAZIR DEĞİL):')
        for rel, ne in bulgular: print(f'  {rel} ← {ne}')
        return 1
    print(f'\n✓ son-tarama TEMİZ — https://{host}/ üretim SEO durumunda.')
    print('  Hatırlatma: Search Console\'da property doğrula + sitemap gönder; edge/CDN önbelleğini temizle.')
    return 0

if __name__ == '__main__':
    sys.exit(main())
