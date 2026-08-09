#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""No-cache geliştirme sunucusu — TÜM yanıtlara Cache-Control: no-store basar.
Tarayıcının bayat HTML/JS/CSS göstermesini (heuristik cache + aynı-saniye
Last-Modified 304'ü) kökten engeller. Kullanım: python3 scripts/nocache-server.py <port>"""
import http.server, socketserver, sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8799

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    def log_message(self, fmt, *args):
        pass  # sessiz

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("", PORT), NoCacheHandler) as httpd:
    print(f"no-cache sunucu: http://localhost:{PORT}/")
    httpd.serve_forever()
