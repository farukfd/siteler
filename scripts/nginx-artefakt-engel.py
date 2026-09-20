#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""NGINX ARTEFAKT ENGELİ — docroot içinde kalan yedek/artefakt dosyalarının (x.html.bak_sosyal_…,
x.html.locked.…, x.html.ewall.…, .git/…) internetten indirilmesini tüm vhost'larda 404'e çevirir.

  python3 scripts/nginx-artefakt-engel.py            # kuru koşu: birleşik diff, hiçbir şey yazmaz
  python3 scripts/nginx-artefakt-engel.py --apply    # yedek + yaz + nginx -t (başarısızsa geri al) + reload + canlı teyit

Mevcut kural (`location ~* \\.(bak|swp|…)$`) yalnız .bak ile BİTEN dosyayı tutar; sunucudaki
yedekler `.bak_<etiket>`, `.locked.<ts>`, `.ewall.<ts>` gibi eklerle bittiği için hiçbirini yakalamıyordu
(20 Eyl 2026 denetimi: 5 tenant docroot'unda 941 açık dosya). Snippet her `server_name …;` satırının
hemen altına `include` ile girer → regex location'lar sırayla eşleştiğinden önce gelir ve kazanır.
Silme YOK: değişen her conf'un yanına `.bak_artefakt_<ts>` kopyası alınır; geri alma = kopyayı geri yazmak.
"""
import re, sys, os, glob, shutil, subprocess, time, difflib

SNIPPET = '/etc/nginx/snippets/nadas-artefakt-engel.conf'
SNIPPET_ICERIK = r'''# NADAS — docroot içinde kalan yedek/artefakt dosyaları asla servis edilmez
# (scripts/nginx-artefakt-engel.py üretir; elle düzenleme yerine betiği güncelleyin)
location ~* \.(bak|swp|save|old|orig|backup|bozuk|tmp)(\.|_|$) { return 404; }
location ~* \.(html?|css|js|json|svg|txt|xml|webp|png|jpe?g|ico)\.(bak|locked|ewall|mono|mrdyn|genbs|hgv|fs|pre_redir|removed|meridyen|orig|old|save|swp|tmp)[^/]*$ { return 404; }
location ~ /\.(?!well-known/) { return 404; }
'''
INCLUDE = '    include {};'.format(SNIPPET)
SERVER_NAME = re.compile(r'^\s*server_name\s+[^;]+;\s*$')
DOGRULAMA = [  # (url, beklenen kod)
    ('https://10lineemlak.com/hakkimizda.html.bak_sosyal_20260919_0813', 404),
    ('https://10lineemlak.com/harita.html.locked.1787169169', 404),
    ('https://10lineemlak.com/hakkimizda.html', 200),
    ('https://www.emlakekspertizi.com/', 200),
    ('https://www.nadas.com.tr/', 200),
    ('https://emlaktahadimkoy.com/', 200),
]

def oku(p):
    with open(p, encoding='utf-8') as f: return f.read()

def donustur(metin):
    """Her server_name satırının altına include (zaten varsa dokunma)."""
    satirlar = metin.split('\n'); cikti = []; n = 0
    for i, s in enumerate(satirlar):
        cikti.append(s)
        if SERVER_NAME.match(s):
            sonraki = next((x for x in satirlar[i+1:i+4] if x.strip()), '')
            if sonraki.strip() != INCLUDE.strip():
                cikti.append(INCLUDE); n += 1
    return '\n'.join(cikti), n

def main():
    apply = '--apply' in sys.argv
    test_modu = '--test-dizin' in sys.argv           # yerel test: nginx çağrılmaz, yollar test dizininden
    if test_modu:
        kok = sys.argv[sys.argv.index('--test-dizin') + 1]
        dizinler = [os.path.join(kok, 'conf.d'), os.path.join(kok, 'prox_api')]
        snippet = os.path.join(kok, 'snippets', 'nadas-artefakt-engel.conf')
    else:
        dizinler = ['/etc/nginx/conf.d', '/etc/nginx/prox_api']
        snippet = SNIPPET
    ts = time.strftime('%Y%m%d_%H%M%S')
    dosyalar = sorted(f for d in dizinler for f in glob.glob(os.path.join(d, '*.conf')))
    plan = []
    for f in dosyalar:
        once = oku(f); sonra, n = donustur(once)
        if n: plan.append((f, once, sonra, n))

    snippet_var = os.path.isfile(snippet) and oku(snippet) == SNIPPET_ICERIK
    print('{} conf incelendi · {} dosyada {} server bloğuna include girecek · snippet {}'.format(
        len(dosyalar), len(plan), sum(p[3] for p in plan), 'güncel' if snippet_var else 'YAZILACAK'))
    if not apply:
        if not snippet_var:
            print('\n--- {} (yeni) ---\n{}'.format(snippet, SNIPPET_ICERIK))
        for f, once, sonra, n in plan:
            sys.stdout.writelines(difflib.unified_diff(once.splitlines(True), sonra.splitlines(True), f, f + ' (yeni)', n=1))
        print('\nKuru koşu — uygulamak için --apply')
        return 0

    # ── uygulama: yedek → yaz → nginx -t → (hata: geri al) → reload → teyit
    yedekler = []
    os.makedirs(os.path.dirname(snippet), exist_ok=True)
    if os.path.isfile(snippet) and not snippet_var:
        shutil.copy2(snippet, snippet + '.bak_artefakt_' + ts); yedekler.append((snippet, snippet + '.bak_artefakt_' + ts))
    with open(snippet, 'w', encoding='utf-8') as fh: fh.write(SNIPPET_ICERIK)
    for f, once, sonra, n in plan:
        y = f + '.bak_artefakt_' + ts
        shutil.copy2(f, y); yedekler.append((f, y))
        with open(f, 'w', encoding='utf-8') as fh: fh.write(sonra)
        print('  yazıldı: {} (+{} include) · yedek: {}'.format(f, n, y))
    if test_modu:
        print('test modu: nginx -t / reload atlandı'); return 0
    t = subprocess.run(['nginx', '-t'], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, universal_newlines=True)
    print(t.stdout.strip())
    if t.returncode != 0:
        for f, y in yedekler: shutil.copy2(y, f)
        print('✗ nginx -t BAŞARISIZ → tüm dosyalar yedekten geri alındı (yedekler duruyor). Hiçbir şey reload edilmedi.')
        return 1
    r = subprocess.run(['nginx', '-s', 'reload'], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, universal_newlines=True)
    print('reload: {}'.format(r.stdout.strip() or 'OK'))
    time.sleep(2)
    sonuc = 0
    for url, beklenen in DOGRULAMA:
        c = subprocess.run(['curl', '-s', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '15', url + '?ts=' + ts],
                           stdout=subprocess.PIPE, universal_newlines=True).stdout.strip()
        ok = c == str(beklenen); sonuc |= (not ok)
        print('  {} {:>3} (beklenen {}) {}'.format('✓' if ok else '✗', c, beklenen, url))
    print('\nCANLI TEYİT: {}'.format('PASS' if not sonuc else 'FAIL — Cloudflare önbelleği olabilir; .bak URL için purge deneyin'))
    print('Geri alma: for y in *.bak_artefakt_{}: cp -a <yedek> <conf>; nginx -t && nginx -s reload'.format(ts))
    return sonuc

if __name__ == '__main__':
    sys.exit(main())
