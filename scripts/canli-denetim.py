#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""FAZ3D CANLI DENETİM — üretim subdomain'lerinde gerçek HTTP kanıtı.
Sitemap URL'leri (status/canonical/robots/title/H1) + X-Robots + auth-501 + alias-301 +
gelecek-tarih + yasak-desen + llms.txt. Çıktı: kriter başına PASS/FAIL + kanıt."""
import re, sys, json, urllib.request, ssl
from collections import Counter

CTX = ssl.create_default_context()
HOSTS = {'danisman': 'https://danisman.emlakekspertizi.com', 'insaat': 'https://insaat.emlakekspertizi.com'}
SONUC = []
def kayit(no, ad, ok, kanit):
    SONUC.append((no, ad, ok))
    print(f"[{'PASS' if ok else 'FAIL':4s}] {no} {ad}\n       {kanit}")

def al(url, method='GET', timeout=15):
    req = urllib.request.Request(url, method=method, headers={'User-Agent': 'NADAS-canli-denetim/1.0'})
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=CTX) as r:
            return r.status, dict((k.lower(), v) for k, v in r.headers.items()), r.read().decode('utf-8', 'ignore')
    except urllib.error.HTTPError as e:
        return e.code, dict((k.lower(), v) for k, v in e.headers.items()), ''
    except Exception as e:
        return 0, {}, str(e)

# ── 1) Sitemap URL'leri: 200 + doğru canonical + tek robots(index) + title + X-Robots yok ──
toplam_url = 0
for site, base in HOSTS.items():
    st, hd, sm = al(base + '/sitemap.xml')
    urls = re.findall(r'<loc>([^<]+)</loc>', sm)
    toplam_url += len(urls)
    kotu = []
    for u in urls:
        s2, h2, b2 = al(u)
        if s2 != 200: kotu.append(f'{u}→{s2}'); continue
        if 'noindex' in h2.get('x-robots-tag', ''): kotu.append(f'{u}→hdr-noindex')
        can = re.findall(r'<link rel="canonical" href="([^"]+)"', b2)
        if not can or can[0].rstrip('/') != u.rstrip('/'): kotu.append(f'{u}→canonical:{can[:1]}')
        rb = re.findall(r'name="robots" content="([^"]+)"', b2)
        if len(rb) != 1 or 'index,follow' not in rb[0]: kotu.append(f'{u}→robots:{rb}')
        if '<title>' not in b2: kotu.append(f'{u}→title-yok')
    kayit('T1', f'{site}: sitemap {len(urls)} URL — 200+canonical+index,follow+title', not kotu, f'sorun:{kotu[:4]}')

# ── 2) X-Robots: üretimde yok, admin-assets 403, llms.txt temiz ──
for site, base in HOSTS.items():
    st, hd, _ = al(base + '/')
    st2, hd2, _ = al(base + '/llms.txt')
    kayit('T2', f'{site}: X-Robots-Tag üretimde yok (kök+llms)', 'x-robots-tag' not in hd and 'x-robots-tag' not in hd2,
          f"kök:{hd.get('x-robots-tag','—')} llms:{hd2.get('x-robots-tag','—')} llms-status:{st2}")
adm_d = al(HOSTS['danisman'] + '/admin-assets/app-admin.js?t2')[0]
adm_i = al(HOSTS['insaat'] + '/admin-assets/app-core-admin.js?t2')[0]
kayit('T3', 'admin-assets anonim erişime kapalı', adm_d == 403 and adm_i == 403, f'dn:{adm_d} ins:{adm_i}')

# ── 3) auth uçları dürüst 501 (404 ölü UI yok) ──
codes = [al(HOSTS['danisman'] + p, 'POST')[0] for p in ('/api/auth/user/login', '/api/auth/admin/login', '/api/v1/tenant/portal/login')]
kayit('T4', 'auth uçları 404 değil, tutarlı 501', all(c == 501 for c in codes), f'{codes}')

# ── 4) ins alias 301 + /index.html 301 + .bak 404 ──
alias_ok = True; det = []
for p, hedef in [('/hizmetler', '/hizmetlerimiz.html'), ('/projeler', '/projelerimiz.html'), ('/bolge', '/bolge.html'),
                 ('/iletisim', '/#iletisim'), ('/soru-cevap', '/soru-cevap.html'), ('/asistan', '/#asistan')]:
    req = urllib.request.Request(HOSTS['insaat'] + p, method='HEAD')
    try:
        import urllib.request as ur
        opener = ur.build_opener(type('NR', (ur.HTTPRedirectHandler,), {'redirect_request': lambda *a, **k: None}))
        r = opener.open(req, timeout=12)
        st3, loc = r.status, r.headers.get('Location', '')
    except urllib.error.HTTPError as e:
        st3, loc = e.code, e.headers.get('Location', '')
    if st3 != 301 or not loc.endswith(hedef): alias_ok = False; det.append(f'{p}→{st3},{loc}')
kayit('T5', 'ins alias rotaları 301 (JS gerekmez)', alias_ok, f'sorun:{det[:3]}' if det else '6/6 doğru hedefe 301')
bak = al(HOSTS['danisman'] + '/index.html.bak')[0]
kayit('T6', '/index.html.bak ana sayfaya redirect DEĞİL (404)', bak == 404, f'status:{bak}')

# ── 5) gelecek tarihli içerik canlıda yok ──
b_ins = al(HOSTS['insaat'] + '/blog.html?t5')[2]
gel = re.findall(r'(1[5-9]|2[0-9]|3[01]) Ağustos 2026', b_ins)
kayit('T7', 'gelecek tarihli içerik public sayfada yok (ins blog)', not gel, f'bulunan:{gel[:3]}')

# ── 6) public bundle yasak desen + kaynak HTML işaretleri ──
js = al(HOSTS['danisman'] + '/js/app.js?t6')[2] + al(HOSTS['insaat'] + '/js/app-core.js?t6')[2]
yasak = [p for p in ('deepseek', 'anthropic', 'openai', 'claude', 'sk-ant', 'EIDS_DEMO', '_insDemoEids', '0034812', 'tenant_key', 'sysPrompt') if p.lower() in js.lower()]
kayit('T8', 'canlı bundle: sağlayıcı/model/prompt/eski-anahtar sıfır', not yasak, f'bulunan:{yasak}')
ana = al(HOSTS['danisman'] + '/?t6')[2]
kayit('T9', 'canlı kaynak: NADAS satırı + storage-guard + EMLAK_DEMO=false',
      'nadas-c' in ana and 'storage-guard' in ana and 'EMLAK_DEMO=false' in ana, 'üç işaret de ilk HTML kaynağında')

# ── 7) BFF same-origin canlı ──
bs = al(HOSTS['danisman'] + '/api/v1/tenant/bootstrap')[2]
kayit('T10', 'same-origin bootstrap 200 success (tenant Host\'tan)', '"success":true' in bs.replace(' ', '') or '"success": true' in bs, bs[:90])

print('\n──── ÖZET ────')
c = Counter('PASS' if ok else 'FAIL' for _, _, ok in SONUC)
print(dict(c), f'· sitemap URL toplam: {toplam_url}')
sys.exit(0 if c.get('FAIL', 0) == 0 else 1)
