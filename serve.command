#!/bin/bash
# Meridyen yerel sunucu — çift tıkla veya `./serve.command` ile çalıştır.
cd "$(dirname "$0")"
echo "Meridyen yerel sunucu → http://localhost:8765/"
echo "  · İnşaat:    http://localhost:8765/insaat.html"
echo "  · Değerleme: http://localhost:8765/degerleme/index.html"
echo "  · Admin:     http://localhost:8765/degerleme/admin.html"
echo "Durdurmak için: Ctrl+C"
python3 -m http.server 8765
