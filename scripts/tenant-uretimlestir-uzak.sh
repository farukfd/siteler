#!/usr/bin/env bash
# TENANT SEO ÜRETİMLEŞTİRME — UZAK UYGULAYICI (yerel makineden, SSH alias ile)
#
#   scripts/tenant-uretimlestir-uzak.sh <ssh-alias> <docroot> <host> [--apply]
#   scripts/tenant-uretimlestir-uzak.sh nadas-prod /var/www/10lineemlak 10lineemlak.com          # yalnız kuru koşu
#   scripts/tenant-uretimlestir-uzak.sh nadas-prod /var/www/10lineemlak 10lineemlak.com --apply  # uygula + canlı teyit
#
# Docroot bilinmiyorsa:  ssh nadas-prod -- 'grep -rl 10lineemlak /etc/nginx/sites-enabled/ | xargs grep -h "root "'
#
# nadas-ssh-operations kuralları: SİLME YOK (rm/--delete kullanılmaz); mevcut dosya değişmeden
# önce aynı sunucuda zaman damgalı salt-okunur yedek alınır; her adım exit code'u kontrol edilir;
# canlı teyit cache-bust'lı curl ile yapılır (bağlanabilmek kanıt değildir).
set -euo pipefail

ALIAS="${1:?ssh alias (ör. nadas-prod)}"
DOCROOT="${2:?sunucu docroot (ör. /var/www/10lineemlak)}"
HOST="${3:?tenant alan adı (ör. 10lineemlak.com)}"
MODE="${4:-}"
KOK="$(cd "$(dirname "$0")/.." && pwd)"
BETIK="$KOK/scripts/tenant-uretimlestir.py"
DAMGA="$(date +%Y%m%d_%H%M%S)"
UZAK_BETIK="/root/tenant-uretimlestir_${DAMGA}.py"
YEDEK="${DOCROOT%/}_yedek_${DAMGA}"

echo "══ 1) Hedef doğrulama ($ALIAS)"
ssh -o BatchMode=yes -o ConnectTimeout=10 "$ALIAS" -- "hostname; whoami; date -u; test -d '$DOCROOT' && echo 'docroot OK: $DOCROOT' || { echo 'docroot YOK: $DOCROOT'; exit 2; }"

echo "══ 2) Canlı ÖNCE durumu (cache-bust)"
curl -s "https://$HOST/?ts=$(date +%s)" | grep -o '<meta name="robots"[^>]*>' || echo '(robots meta yok)'
curl -s "https://$HOST/robots.txt?ts=$(date +%s)" | head -5

echo "══ 3) Betik sunucuya kopyalanıyor → $UZAK_BETIK"
scp -q "$BETIK" "$ALIAS:$UZAK_BETIK"

echo "══ 4) Kuru koşu"
ssh -o BatchMode=yes "$ALIAS" -- "python3 '$UZAK_BETIK' --docroot '$DOCROOT' --host '$HOST' --dry-run"

if [ "$MODE" != "--apply" ]; then
  echo; echo "Kuru koşu bitti. Uygulamak için sonuna --apply ekleyin."; exit 0
fi

echo "══ 5) Salt-okunur zaman damgalı yedek → $YEDEK (silinmez)"
ssh -o BatchMode=yes "$ALIAS" -- "cp -a '$DOCROOT' '$YEDEK' && chmod -R a-w '$YEDEK' && du -sh '$YEDEK'"

echo "══ 6) Uygulama"
ssh -o BatchMode=yes "$ALIAS" -- "python3 '$UZAK_BETIK' --docroot '$DOCROOT' --host '$HOST'"

echo "══ 7) Canlı SONRA teyidi (cache-bust; edge/CF önbelleği varsa önce temizleyin)"
sleep 2
META="$(curl -s "https://$HOST/?ts=$(date +%s)" | grep -o '<meta name="robots"[^>]*>' || true)"
ROBOTS="$(curl -s "https://$HOST/robots.txt?ts=$(date +%s)")"
SITEMAP="$(curl -s "https://$HOST/sitemap.xml?ts=$(date +%s)")"
echo "ana sayfa robots meta : ${META:-(yok)}"
echo "robots.txt            : $(echo "$ROBOTS" | tr '\n' ' ' | cut -c1-120)"
echo "sitemap URL / yabancı : $(echo "$SITEMAP" | grep -c '<loc>') / $(echo "$SITEMAP" | grep -c 'emlakekspertizi' || true)"
SONUC=PASS
echo "$META"   | grep -q 'index,follow,max-image-preview:large' || SONUC=FAIL
echo "$META"   | grep -q 'noindex' && SONUC=FAIL
echo "$ROBOTS" | grep -q '^Allow: /' || SONUC=FAIL
echo "$ROBOTS" | grep -q "^Sitemap: https://$HOST/sitemap.xml" || SONUC=FAIL
echo "$SITEMAP" | grep -q 'emlakekspertizi' && SONUC=FAIL
echo; echo "CANLI TEYİT: $SONUC   (rollback: cp -a '$YEDEK'/. '$DOCROOT'/ — yedek silinmez)"
[ "$SONUC" = PASS ] || { echo "FAIL ise büyük ihtimalle edge önbelleği: HTML için purge yapıp bu adımı tekrar çalıştırın."; exit 1; }
