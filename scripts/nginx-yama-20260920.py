#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""NGINX YAMASI 20 Eyl 2026 — (1) 10lineemlak soft-404 kapatma, (2) nadas duplicate-MIME uyarısı.

  python3 scripts/nginx-yama-20260920.py            # kuru koşu: diff, yazmaz
  python3 scripts/nginx-yama-20260920.py --apply    # yedek → yaz → nginx -t (hata: geri al) → reload → canlı teyit

(1) custom-10lineemlak_com.conf: `try_files $uri $uri.html $uri/ /index.html` her olmayan URL'yi ana sayfa
    olarak 200 döndürüyordu (soft-404; sitemap'teki eski İzmir URL'leri, /.git/HEAD, rastgele yollar…).
    → `=404` (error_page 404 /404.html zaten var, 404.html noindex) + ov-pre derin-link listesindeki
    dosyasız 7 overlay takma adı için açık alias location (index.html, 200) — davranış korunur.
    Dosyası olan yollar (/hakkimizda → hakkimizda.html) `$uri.html` ile zaten çözülüyor, alias'a girmez.
(2) custom-nadas_com_tr.conf: `charset_types … text/html` — text/html varsayılan olarak zaten dahil,
    nginx her -t/reload'da "duplicate MIME type" uyarıyor. → text/html satırdan çıkar.
Silme yok: değişen conf'un yanına .bak_yama20260920_<ts> kopyası; geri alma = kopyayı geri yazmak.
"""
import sys, os, shutil, subprocess, time, difflib

ALIAS = ('    # ov-pre derin-link takma adları (dosyası yok; index.html overlay\'i açar) — soft-404 kapatılırken korunur\n'
         '    location ~ ^/(portfoy-ilan|ozel-portfoy|portfoy-ozel|degerleme|referans|alarm|mesafeli)/?$ { try_files /index.html =404; }\n')
YAMALAR = [
    ('/etc/nginx/conf.d/custom-10lineemlak_com.conf',
     '    location / { try_files $uri $uri.html $uri/ /index.html; }\n',
     ALIAS + '    location / { try_files $uri $uri.html $uri/ =404; }\n'),
    ('/etc/nginx/conf.d/custom-nadas_com_tr.conf',
     '    charset_types text/plain text/xml text/css application/javascript application/json text/html;\n',
     '    charset_types text/plain text/xml text/css application/javascript application/json;\n'),
]
DOGRULAMA = [
    ('https://10lineemlak.com/boyle-bir-sayfa-yok-XYZ.html', 404),
    ('https://10lineemlak.com/bornova.html', 404),
    ('https://10lineemlak.com/.git/HEAD', 404),
    ('https://10lineemlak.com/', 200),
    ('https://10lineemlak.com/hakkimizda', 200),
    ('https://10lineemlak.com/hakkimizda.html', 200),
    ('https://10lineemlak.com/analiz/', 200),
    ('https://10lineemlak.com/portfoy-ilan', 200),
    ('https://10lineemlak.com/referans/', 200),
    ('https://10lineemlak.com/js/brand.js', 200),
    ('https://www.nadas.com.tr/', 200),
]

def oku(p):
    with open(p, encoding='utf-8') as f: return f.read()

def main():
    apply = '--apply' in sys.argv
    kok = sys.argv[sys.argv.index('--test-kok') + 1] if '--test-kok' in sys.argv else ''
    ts = time.strftime('%Y%m%d_%H%M%S'); plan = []; hata = 0
    for dosya, eski, yeni in YAMALAR:
        yol = kok + dosya
        if not os.path.isfile(yol): print('✗ yok: ' + yol); hata = 1; continue
        s = oku(yol)
        if yeni in s and eski not in s: print('= zaten uygulanmış: ' + yol); continue
        n = s.count(eski)
        if n != 1: print('✗ beklenen satır {} kez bulundu (1 olmalı): {}'.format(n, yol)); hata = 1; continue
        plan.append((yol, s, s.replace(eski, yeni, 1)))
    if hata: print('Yama uygulanmadı — conf beklenen biçimde değil, elle inceleyin.'); return 2
    if not plan: print('Yapılacak değişiklik yok.'); return 0
    if not apply:
        for yol, once, sonra in plan:
            sys.stdout.writelines(difflib.unified_diff(once.splitlines(True), sonra.splitlines(True), yol, yol + ' (yeni)', n=2))
        print('\nKuru koşu — uygulamak için --apply'); return 0
    yedekler = []
    for yol, once, sonra in plan:
        y = yol + '.bak_yama20260920_' + ts; shutil.copy2(yol, y); yedekler.append((yol, y))
        with open(yol, 'w', encoding='utf-8') as f: f.write(sonra)
        print('  yazıldı: {} · yedek: {}'.format(yol, y))
    if kok: print('test modu: nginx -t / reload atlandı'); return 0
    t = subprocess.run(['nginx', '-t'], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, universal_newlines=True)
    print(t.stdout.strip())
    if t.returncode != 0:
        for yol, y in yedekler: shutil.copy2(y, yol)
        print('✗ nginx -t BAŞARISIZ → yedekten geri alındı, reload YOK.'); return 1
    r = subprocess.run(['nginx', '-s', 'reload'], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, universal_newlines=True)
    print('reload: ' + (r.stdout.strip() or 'OK')); time.sleep(2); fail = 0
    for url, bek in DOGRULAMA:
        c = subprocess.run(['curl', '-s', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '15', url + '?ts=' + ts],
                           stdout=subprocess.PIPE, universal_newlines=True).stdout.strip()
        ok = c == str(bek); fail |= (not ok); print('  {} {:>3} (beklenen {}) {}'.format('✓' if ok else '✗', c, bek, url))
    b = subprocess.run(['curl', '-s', '--max-time', '15', 'https://10lineemlak.com/boyle-bir-sayfa-yok-XYZ.html?ts=' + ts],
                       stdout=subprocess.PIPE, universal_newlines=True).stdout
    ok = ('noindex' in b and 'Sayfa Bulunamad' in b); fail |= (not ok)
    print('  {} 404 gövdesi = 404.html (noindex) {}'.format('✓' if ok else '✗', '' if ok else '— gövde beklenen değil'))
    print('\nCANLI TEYİT: ' + ('PASS' if not fail else 'FAIL'))
    print('Geri alma: cp -a <conf>.bak_yama20260920_{} <conf>; nginx -t && nginx -s reload'.format(ts))
    return fail

if __name__ == '__main__':
    sys.exit(main())
