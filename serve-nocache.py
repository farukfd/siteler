#!/usr/bin/env python3
# Önbelleksiz yerel statik sunucu — tarayıcı asla eski sürümü göstermez.
# Kullanım: python3 serve-nocache.py [port]   (varsayılan 8765)
import sys, http.server, socketserver

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('', PORT), NoCacheHandler) as httpd:
    print(f'no-cache server → http://localhost:{PORT}/')
    httpd.serve_forever()
