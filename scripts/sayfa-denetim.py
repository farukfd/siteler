#!/usr/bin/env python3
"""3 sitenin tüm HTML sayfalarında: (1) inline <script> bloklarına node --check,
(2) görünür metne sızmış JS taraması. Kullanım: python3 scripts/sayfa-denetim.py"""
import re, glob, subprocess, sys, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fail = 0
for f in sorted(glob.glob(ROOT+'/gayrimenkul/*.html') + glob.glob(ROOT+'/danisman/*.html') + glob.glob(ROOT+'/insaat/*.html')):
    s = open(f).read()
    rel = f[len(ROOT)+1:]
    # (1) inline script syntax
    for n, m in enumerate(re.finditer(r'<script\b(?![^>]*\bsrc=)(?![^>]*\btype=["\'](?:application|importmap|module)[^"\']*["\'])[^>]*>(.*?)</script>', s, re.S|re.I)):
        code = m.group(1).strip()
        if not code: continue
        open('/tmp/_blk.js','w').write(code)
        r = subprocess.run(['node','--check','/tmp/_blk.js'], capture_output=True, text=True)
        if r.returncode != 0:
            print(f'SYNTAX  {rel} · inline#{n+1}: ' + [l for l in r.stderr.strip().split('\n') if 'Error' in l or 'error' in l][:1] and [l for l in r.stderr.strip().split('\n') if 'Error' in l][0][:140] or r.stderr.strip().split('\n')[0][:140]); fail += 1
    # (2) görünür metinde JS sızıntısı
    body = s[s.find('<body'):]
    vis = re.sub(r'<script\b.*?</script>', ' ', body, flags=re.S|re.I)
    vis = re.sub(r'<style\b.*?</style>', ' ', vis, flags=re.S|re.I)
    vis = re.sub(r'<[^>]+>', ' ', vis)
    for pat in ['function(', 'window.', 'document.getElementById', 'localStorage.']:
        if pat in vis:
            print(f'SIZINTI {rel}: "{pat}" → {vis[vis.find(pat):vis.find(pat)+70]!r}'); fail += 1; break
print(('SORUN: %d' % fail) if fail else 'TEMİZ — tüm sayfalar geçti')
sys.exit(1 if fail else 0)
