#!/usr/bin/env bash
# =============================================================================
# NADAS-WEB-2030 · SUNUCU KURTARMA VE YAZMA-DONDURMA ARACI
# -----------------------------------------------------------------------------
# Baglam: Cloudflare "Host Error" (origin yanit vermiyor) + hosting saglayicisinin
#         yuksek disk I/O uyarisi.
#
# MODLAR:
#   teshis          (VARSAYILAN, SALT-OKUR) Sunucu neden dustu? Kanit toplar.
#   ayaga-kaldir    Acil disk alani acar (log ROTATE eder, SILMEZ) + web yiginini baslatir.
#   yazma-dondur    Blog haber uretimi HARIC periyodik yazmalari durdurur.
#   geri-al         yazma-dondur'un urettigi geri-alma script'ini calistirir.
#
# DENETIM/LOG ILKESI (onemli):
#   · Hicbir log dosyasi SILINMEZ veya SIFIRLANMAZ (audit izi korunur).
#   · Buyuk canli loglar logrotate ile DONDURULUR (rotate); eski ARSIV kopyalar
#     (>7 gun, .gz/.N) temizlenir — bu standart bakimdir, denetim kaybi degil.
#   · btmp/wtmp/secure/auth.log ASLA truncate edilmez.
#   · journald diske yazmaya devam eder; yalnizca ust SINIR (SystemMaxUse) konur.
#   · Durdurulan HER SEY rapora yazilir ve geri-alma script'i otomatik uretilir.
# =============================================================================
set -u

MOD="${1:-teshis}"
ZAMAN="$(date +%Y%m%d-%H%M%S)"
KOK="/root"; [ -w "$KOK" ] 2>/dev/null || KOK="/tmp"
RAPOR="$KOK/kurtarma-${MOD}-${ZAMAN}.txt"
GERIAL="$KOK/geri-al-${ZAMAN}.sh"

# --- Blog haber uretimi + hayati servisler: BUNLARA DOKUNULMAZ ---------------
KORU_DESEN='blog|haber|news|icerik|content|gunicorn|uvicorn|nginx|sshd|ssh\.service|fail2ban|firewalld|nftables|iptables|chronyd|systemd-|dbus|polkit|getty|network|resolved|udev|auditd'

bolum(){ printf '\n\n===== %s =====\n' "$*"; }
alt()  { printf '\n--- %s ---\n' "$*"; }
var()  { command -v "$1" >/dev/null 2>&1; }
kayit(){ printf '%s\n' "$*" >> "$GERIAL"; }

[ "$(id -u)" -eq 0 ] || { echo "HATA: root gerekli.  sudo bash $0 $MOD"; exit 1; }

# =============================================================================
teshis() {
bolum "0 · OZET — SITE NEDEN DUSTU?"
printf 'Zaman: %s\n' "$(date '+%F %T %Z')"
printf 'Host : %s\n' "$(hostname -f 2>/dev/null || hostname)"

SORUN=""

alt "DISK ALANI  (Cloudflare Host Error'un 1 numarali sebebi: disk %100)"
df -hT -x tmpfs -x devtmpfs 2>/dev/null || df -h
DOLU=$(df -P / 2>/dev/null | awk 'NR==2{gsub("%","",$5); print $5}')
[ "${DOLU:-0}" -ge 95 ] 2>/dev/null && SORUN="${SORUN}
  ** KOK DISK %${DOLU} DOLU -> nginx/backend yazamaz, servisler olur. **"

alt "INODE"
df -i -x tmpfs -x devtmpfs 2>/dev/null || df -i
INODE=$(df -iP / 2>/dev/null | awk 'NR==2{gsub("%","",$5); print $5}')
[ "${INODE:-0}" -ge 95 ] 2>/dev/null && SORUN="${SORUN}
  ** INODE %${INODE} DOLU -> yeni dosya acilamaz. **"

alt "KRITIK SERVIS DURUMLARI"
for s in nginx httpd gunicorn uvicorn php-fpm mysqld mariadb postgresql redis fail2ban crond cron; do
  if systemctl list-unit-files 2>/dev/null | grep -q "^${s}\."; then
    D=$(systemctl is-active "$s" 2>/dev/null)
    E=$(systemctl is-enabled "$s" 2>/dev/null)
    printf '%-14s aktif=%-10s acilista=%s\n' "$s" "$D" "$E"
    [ "$D" != "active" ] && SORUN="${SORUN}
  ** ${s} CALISMIYOR (durum: ${D}) **"
  fi
done
alt "Web/uygulama birimleri (ad ne olursa olsun)"
systemctl list-units --type=service --all --no-pager --no-legend 2>/dev/null \
  | grep -iE 'nginx|gunicorn|uvicorn|prox|saas|tenant|emlak|blog|haber' | head -20

alt "BASARISIZ (failed) BIRIMLER"
systemctl list-units --state=failed --no-pager --no-legend 2>/dev/null || echo "(yok)"

alt "OOM KILLER — cekirdek bellek yetersizliginden surec oldurdu mu?"
if var journalctl; then
  journalctl -k --since "-24h" --no-pager 2>/dev/null | grep -iE 'out of memory|oom-kill|killed process' | tail -20
else
  grep -iE 'out of memory|oom-kill|killed process' /var/log/messages /var/log/syslog 2>/dev/null | tail -20
fi
printf '(bossa: son 24 saatte OOM yok)\n'
if var journalctl && journalctl -k --since "-24h" --no-pager 2>/dev/null | grep -qiE 'oom-kill|killed process'; then
  SORUN="${SORUN}
  ** OOM KILLER TETIKLENDI -> RAM yetersiz; surecler olduruldu. **"
fi

alt "DISK G/C HATASI veya SALT-OKUNUR DOSYA SISTEMI"
if var journalctl; then
  journalctl -k --since "-24h" --no-pager 2>/dev/null \
    | grep -iE 'I/O error|read-only file system|remount.*read-only|EXT4-fs error|blk_update_request|xfs.*corrupt' | tail -20
fi
if mount | grep -E ' / | /var ' | grep -q '\bro\b'; then
  SORUN="${SORUN}
  ** DOSYA SISTEMI SALT-OKUNUR MONTE EDILMIS -> hicbir yazma mumkun degil. **"
fi
printf '(bossa: cekirdek seviyesinde disk hatasi yok)\n'

alt "SAGLAYICI I/O LIMITI IZLERI (blkio/cgroup throttle)"
for f in /sys/fs/cgroup/blkio/blkio.throttle.read_bps_device \
         /sys/fs/cgroup/blkio/blkio.throttle.write_bps_device \
         /sys/fs/cgroup/io.max; do
  [ -r "$f" ] && { printf '%s:\n' "$f"; cat "$f" 2>/dev/null; }
done
printf '(cikti varsa: saglayici I/O limiti UYGULAMIS olabilir -> maildeki uyari hayata gecmis)\n'

alt "YUK VE BELLEK"
cat /proc/loadavg
free -h 2>/dev/null || free
var vmstat && { printf '\nvmstat (si/so sifir degilse swap thrashing):\n'; vmstat 1 3; }

alt "ORIGIN YEREL TESTI — nginx kendi icinden yanit veriyor mu?"
for P in 80 443; do
  printf 'localhost:%s -> ' "$P"
  if var curl; then
    curl -sS -o /dev/null -m 10 -k -w 'HTTP %{http_code} (%{time_total}s)\n' \
      "http$([ "$P" = 443 ] && echo s)://127.0.0.1:$P/" 2>&1 | tail -1
  else echo "(curl yok)"; fi
done
alt "Dinlenen portlar (80/443/2222 burada gorunmeli)"
if var ss; then ss -tulpnH 2>/dev/null | grep -E ':(80|443|2222|8000|8001|5000) ' ; else netstat -tulpn 2>/dev/null | grep -E ':(80|443|2222) '; fi

alt "nginx yapilandirma testi"
var nginx && nginx -t 2>&1

alt "nginx error.log — son 40 satir"
tail -40 /var/log/nginx/error.log 2>/dev/null || echo "(okunamadi)"

alt "Uygulama servisi son loglari"
if var journalctl; then
  for u in $(systemctl list-units --type=service --all --no-pager --no-legend 2>/dev/null \
             | grep -oiE '^[^ ]*(gunicorn|uvicorn|prox|saas|tenant|emlak)[^ ]*\.service' | head -4); do
    printf '\n## %s\n' "$u"; journalctl -u "$u" -n 25 --no-pager 2>/dev/null
  done
fi

alt "EN COK YER TUKETEN DIZINLER (/var)"
du -xh --max-depth=1 /var 2>/dev/null | sort -h | tail -12
alt "500 MB uzeri dosyalar (tum sistem, ilk 20)"
find / -xdev -type f -size +500M -printf '%10s bayt  %p\n' 2>/dev/null | sort -rn | head -20
alt "journal disk kullanimi"
var journalctl && journalctl --disk-usage 2>/dev/null

bolum "TESHIS SONUCU"
if [ -n "$SORUN" ]; then
  printf 'TESPIT EDILEN ENGELLER:%s\n' "$SORUN"
  printf '\n-> SONRAKI ADIM:  sudo bash %s ayaga-kaldir\n' "$0"
else
  printf 'Otomatik kontrollerde belirgin engel bulunamadi.\n'
  printf 'Yukaridaki nginx error.log ve uygulama servisi loglarini okuyun.\n'
  printf '-> Yine de denemek icin: sudo bash %s ayaga-kaldir\n' "$0"
fi
}

# =============================================================================
ayaga_kaldir() {
bolum "AYAGA KALDIRMA — $(date '+%F %T')"
printf 'Kural: web koku/veritabani/kullanici verisi ve LOG dosyalari SILINMEZ.\n'
printf 'Yalniz arsiv (rotate edilmis, >7 gun) loglar ve paket onbellegi temizlenir.\n'

bolum "1 · ONCE DURUM (mudahale oncesi kanit)"
df -hT -x tmpfs -x devtmpfs 2>/dev/null
ONCE_KB=$(df -Pk / | awk 'NR==2{print $4}')
printf '\nKok diskte bos alan (once): %s KB\n' "$ONCE_KB"

bolum "2 · ACIL DISK ALANI ACMA (veri/denetim kaybi YOK)"

alt "2.1 · systemd journal UST SINIR + eski parcalari budama (SystemMaxUse=200M)"
if var journalctl; then
  journalctl --disk-usage 2>/dev/null
  # Sinir uzeri eski journal parcalarini budar; guncel kayitlar korunur.
  journalctl --vacuum-size=200M 2>&1 | tail -5
fi

alt "2.2 · Paket onbellegi temizligi (indirilmis .rpm/.deb; sistem etkilenmez)"
if var dnf; then dnf clean all 2>&1 | tail -3
elif var yum; then yum clean all 2>&1 | tail -3
elif var apt-get; then apt-get clean 2>&1 | tail -3; fi

alt "2.3 · ARSIV loglar — 7 gunden eski, ZATEN DONDURULMUS kopyalar (.gz/.N/.old)"
printf 'Silinecekler (yalniz rotate edilmis arsivler; canli loglar degil):\n'
find /var/log -xdev -type f \( -name '*.gz' -o -name '*.[0-9]' -o -name '*.old' \) -mtime +7 \
  -printf '%10s bayt  %p\n' 2>/dev/null | sort -rn | head -30
find /var/log -xdev -type f \( -name '*.gz' -o -name '*.[0-9]' -o -name '*.old' \) -mtime +7 -delete 2>/dev/null
printf '-> 7 gunden eski ARSIV loglar silindi (canli loglar ve denetim izi KORUNDU).\n'

alt "2.4 · Buyuk CANLI loglar — SILINMEZ, logrotate ile DONDURULUR"
printf 'Gerekce: canli logu truncate etmek denetim izini bozar; dogru yol rotate.\n'
BUYUK=$(find /var/log -xdev -type f -size +200M ! -name '*.gz' ! -name '*.[0-9]' 2>/dev/null)
if [ -n "$BUYUK" ]; then
  printf '200 MB uzeri canli loglar:\n%s\n\n' "$BUYUK"
  if var logrotate; then
    logrotate -f /etc/logrotate.conf 2>&1 | tail -5
    printf '-> logrotate -f calisti: buyuk loglar donduruldu+sikistirildi, yeni bos log acildi.\n'
  else
    printf '!! logrotate yok. Bu loglari SILMEDIM. Servisi kisa sure durdurup elle\n'
    printf '!! rotate etmek gerekebilir; adini bana bildirin, guvenli komut cikaralim.\n'
  fi
else
  printf '(200 MB uzeri canli log yok)\n'
fi

alt "2.5 · Silinmis ama surec tarafindan hala ACIK tutulan dosyalar (disk bosalmama sebebi)"
if var lsof; then
  lsof -nP 2>/dev/null | grep -i deleted | awk '{printf "%-14s pid=%-7s %10s  %s\n",$1,$2,$7,$9}' | sort -k3 -rn | head -15
  printf '-> Ustteki bir surec cok yer tutan silinmis dosya aciyorsa, o servisi\n'
  printf '   yeniden baslatmak (reload degil restart) alani serbest birakir.\n'
else
  printf '(lsof yok)\n'
fi

alt "2.6 · Sonuc"
df -hT -x tmpfs -x devtmpfs 2>/dev/null
SONRA_KB=$(df -Pk / | awk 'NR==2{print $4}')
printf '\nKok diskte bos alan (sonra): %s KB  ->  ACILAN: %s MB\n' \
  "$SONRA_KB" "$(( (SONRA_KB - ONCE_KB) / 1024 ))"

bolum "3 · SERVISLERI AYAGA KALDIR"
alt "3.1 · nginx yapilandirma testi (BASARISIZSA BASLATMA)"
if var nginx && nginx -t 2>&1; then
  alt "3.2 · nginx baslat"
  systemctl start nginx 2>&1; sleep 2
  systemctl is-active nginx >/dev/null 2>&1 && printf 'nginx: AKTIF\n' || { printf 'nginx BASLAMADI\n'; systemctl status nginx --no-pager -l 2>&1 | tail -20; }
else
  printf '!! nginx -t BASARISIZ — yapilandirma hatasi var, baslatilmadi.\n'
  printf '!! Yukaridaki hata satirini duzeltmeden nginx baslamaz.\n'
fi

alt "3.3 · Uygulama (backend) servisleri"
for u in $(systemctl list-unit-files --no-pager --no-legend 2>/dev/null \
           | grep -oiE '^[^ ]*(gunicorn|uvicorn|prox|saas|tenant|emlak)[^ ]*\.service' | head -5); do
  printf '%s -> ' "$u"
  systemctl start "$u" 2>&1; sleep 1
  systemctl is-active "$u" 2>/dev/null || { printf 'BASLAMADI\n'; journalctl -u "$u" -n 15 --no-pager 2>&1 | tail -15; }
done

bolum "4 · DOGRULAMA"
alt "Yerel HTTP testi"
for P in 80 443; do
  printf 'localhost:%s -> ' "$P"
  curl -sS -o /dev/null -m 10 -k -w 'HTTP %{http_code} (%{time_total}s)\n' \
    "http$([ "$P" = 443 ] && echo s)://127.0.0.1:$P/" 2>&1 | tail -1
done
alt "Dinlenen portlar"
var ss && ss -tulpnH 2>/dev/null | grep -E ':(80|443) '
alt "Servis ozeti"
for s in nginx fail2ban; do systemctl is-active "$s" >/dev/null 2>&1 && printf '%-12s AKTIF\n' "$s" || printf '%-12s pasif\n' "$s"; done

printf '\n-> Yerel testte HTTP 200/301 goruyorsaniz origin ayakta demektir.\n'
printf '-> Cloudflare hala hata gosteriyorsa: CF panel -> Caching -> Purge Everything.\n'
printf '-> Ardindan yazma yukunu kesmek icin: sudo bash %s yazma-dondur\n' "$0"
}

# =============================================================================
yazma_dondur() {
bolum "YAZMA DONDURMA — blog haber uretimi HARIC periyodik disk yazmalari durduruluyor"
printf 'Zaman: %s\n' "$(date '+%F %T %Z')"
printf "Geri-alma script'i: %s\n" "$GERIAL"
printf 'KORUNAN desen: %s\n' "$KORU_DESEN"

{
  printf '#!/usr/bin/env bash\n'
  printf '# OTOMATIK URETILDI — yazma-dondurma islemini birebir geri alir.\n'
  printf '# Calistirma: sudo bash <bu dosya>\n'
  printf 'set -u\n'
  printf '[ "$(id -u)" -eq 0 ] || { echo "root gerekli"; exit 1; }\n'
  printf 'echo "=== YAZMA DONDURMA GERI ALINIYOR ==="\n'
} > "$GERIAL"
chmod +x "$GERIAL"

DURDURULAN=0

bolum "1 · ZAMANLANMIS ISLER (cron) — periyodik yazmanin ana kaynagi"
alt "Durdurulmadan onceki cron icerikleri (KAYIT — silinmez, yalniz servis durur)"
for f in /etc/crontab /etc/cron.d/* /var/spool/cron/* /var/spool/cron/crontabs/*; do
  [ -f "$f" ] && { printf '\n## %s\n' "$f"; grep -vE '^\s*#|^\s*$' "$f" 2>/dev/null; }
done
alt "cron servisi durduruluyor (dosyalar KORUNUR, sadece calisma durur)"
for s in crond cron; do
  if systemctl list-unit-files 2>/dev/null | grep -q "^${s}\.service"; then
    if systemctl is-active "$s" >/dev/null 2>&1; then
      systemctl stop "$s" 2>&1 && printf 'DURDURULDU: %s\n' "$s" && DURDURULAN=$((DURDURULAN+1))
      kayit "systemctl start $s && echo 'geri: $s baslatildi'"
    else printf 'zaten pasif: %s\n' "$s"; fi
  fi
done
printf '!! NOT: Blog haber uretimi cron ile calisiyorsa bu adim onu da durdurur.\n'
printf '!! Ust cron listesinde blog/haber satiri varsa: geri-alma ile cron%'"'"'u geri acip\n'
printf '!! yalnizca diger satirlari yorumlayin.\n'

bolum "2 · SYSTEMD TIMER'LAR (yedekleme/bakim/temizlik)"
systemctl list-timers --all --no-pager 2>/dev/null | head -30
for t in $(systemctl list-unit-files --type=timer --no-pager --no-legend 2>/dev/null | awk '{print $1}'); do
  if printf '%s' "$t" | grep -qiE "$KORU_DESEN"; then
    printf 'KORUNDU (beyaz liste): %s\n' "$t"; continue
  fi
  if systemctl is-active "$t" >/dev/null 2>&1; then
    systemctl stop "$t" 2>/dev/null && printf 'DURDURULDU: %s\n' "$t" && DURDURULAN=$((DURDURULAN+1))
    kayit "systemctl start $t 2>/dev/null && echo 'geri: $t'"
  fi
done

bolum "3 · YEDEKLEME / SENKRON SERVISLERI"
ps -eo pid,user,etime,args --no-headers 2>/dev/null \
  | grep -iE 'restic|borg|duplicity|rclone|rsync|jetbackup|r1soft|bacula' | grep -v grep | cut -c1-140
for s in $(systemctl list-units --type=service --state=running --no-pager --no-legend 2>/dev/null \
           | awk '{print $1}' | grep -iE 'backup|snapshot|r1soft|jetbackup|duplicity|restic|borg'); do
  printf 'DURDURULDU: %s\n' "$s"; systemctl stop "$s" 2>/dev/null; DURDURULAN=$((DURDURULAN+1))
  kayit "systemctl start $s 2>/dev/null && echo 'geri: $s'"
done
printf '(cikti yoksa: aktif yedekleme sureci yoktu)\n'

bolum "4 · NGINX ERISIM LOGU — dosya bazli yazma yerine TAMPONA alinir"
printf 'Gerekce: her HTTP istegi normalde diske bir satir yazar. buffer+flush ile\n'
printf 'bu yazmalar toplulastirilir; log ICERIGI korunur, disk yazma SIKLIGI duser.\n'
printf '(access_log tamamen kapatilmaz — istek denetimi korunur.)\n'
if [ -d /etc/nginx/conf.d ]; then
  {
    printf '# GECICI — disk I/O dondurma (sunucu-kurtarma.sh yazma-dondur)\n'
    printf '# Erisim logu tampona alindi: yazma sikligi duser, denetim korunur.\n'
    printf 'access_log /var/log/nginx/access.log combined buffer=256k flush=5m;\n'
  } > /etc/nginx/conf.d/zz-io-dondurma.conf
  printf 'OLUSTURULDU: /etc/nginx/conf.d/zz-io-dondurma.conf (buffered access_log)\n'
  kayit "rm -f /etc/nginx/conf.d/zz-io-dondurma.conf && nginx -t && systemctl reload nginx && echo 'geri: nginx erisim logu normale dondu'"
  if nginx -t 2>&1 | tail -2; then
    systemctl reload nginx 2>&1 && printf 'nginx reload edildi\n'
    DURDURULAN=$((DURDURULAN+1))
  else
    printf '!! nginx -t basarisiz — dosya kaldiriliyor, degisiklik uygulanmadi.\n'
    rm -f /etc/nginx/conf.d/zz-io-dondurma.conf
  fi
else
  printf '(/etc/nginx/conf.d yok — atlandi)\n'
fi

bolum "5 · SYSTEMD-JOURNAL — diske yazmaya DEVAM eder, yalniz UST SINIR konur"
printf 'Gerekce: SSH brute-force baskisi journald yazimini artiriyor. Storage/denetim\n'
printf 'AYNEN korunur; sadece SystemMaxUse ile buyume sinirlanir (rotasyon siklasir).\n'
if [ -d /etc/systemd ]; then
  mkdir -p /etc/systemd/journald.conf.d
  {
    printf '[Journal]\n'
    printf 'SystemMaxUse=200M\n'
    printf 'SystemMaxFileSize=20M\n'
  } > /etc/systemd/journald.conf.d/zz-io-dondurma.conf
  kayit "rm -f /etc/systemd/journald.conf.d/zz-io-dondurma.conf && systemctl restart systemd-journald && echo 'geri: journald varsayilan sinirlar'"
  systemctl restart systemd-journald 2>&1 && printf 'journald: ust sinir uygulandi (diske yazim + denetim korundu)\n' && DURDURULAN=$((DURDURULAN+1))
fi

bolum "6 · EN COK YAZAN SURECLER — 20 SANIYELIK OLCUM (karar icin)"
A=$(mktemp); B=$(mktemp)
for p in /proc/[0-9]*; do [ -r "$p/io" ] && printf '%s|%s|%s\n' "${p#/proc/}" \
  "$(awk '/^write_bytes:/{print $2;exit}' "$p/io" 2>/dev/null)" \
  "$(tr '\0|' '  ' < "$p/cmdline" 2>/dev/null | cut -c1-80)"; done > "$A"
sleep 20
for p in /proc/[0-9]*; do [ -r "$p/io" ] && printf '%s|%s|%s\n' "${p#/proc/}" \
  "$(awk '/^write_bytes:/{print $2;exit}' "$p/io" 2>/dev/null)" \
  "$(tr '\0|' '  ' < "$p/cmdline" 2>/dev/null | cut -c1-80)"; done > "$B"
printf '%9s  %-7s %s\n' 'YAZ_MB/s' 'PID' 'KOMUT'
awk -F'|' 'NR==FNR{w[$1]=$2;next} ($1 in w){d=($2-w[$1])/20/1048576; if(d>0) printf "%9.4f  %-7s %s\n",d,$1,$3}' "$A" "$B" \
  | sort -rn | head -15
rm -f "$A" "$B"
printf '\n-> Hala yazan bir surec varsa ve blog/haber ile ilgisi YOKSA adini bildirin;\n'
printf '   hedefli durdurma komutunu cikaralim. Kor durdurma yapilmiyor.\n'

bolum "7 · KORUNAN SERVISLER (bilincli acik birakildi)"
for s in nginx sshd fail2ban firewalld; do
  systemctl is-active "$s" >/dev/null 2>&1 && printf '%-12s AKTIF (korundu)\n' "$s"
done
for u in $(systemctl list-units --type=service --state=running --no-pager --no-legend 2>/dev/null \
           | awk '{print $1}' | grep -iE 'gunicorn|uvicorn|prox|saas|tenant|emlak|blog|haber'); do
  printf '%-30s AKTIF (blog/haber uretimi icin korundu)\n' "$u"
done

{
  printf 'systemctl daemon-reload 2>/dev/null\n'
  printf 'nginx -t 2>/dev/null && systemctl reload nginx 2>/dev/null\n'
  printf 'echo "=== GERI ALMA TAMAMLANDI ==="\n'
} >> "$GERIAL"

bolum "SONUC"
printf 'Durdurulan/degistirilen kalem sayisi : %s\n' "$DURDURULAN"
printf 'Rapor dosyasi                        : %s\n' "$RAPOR"
printf "Geri-alma script'i                   : %s\n" "$GERIAL"
printf '\nHer seyi geri almak icin:\n  sudo bash %s\n' "$GERIAL"
printf '\nDURDURULMAYANLAR (bilincli): nginx, sshd, fail2ban, firewalld,\n'
printf 'gunicorn/uvicorn backend (blog haber uretimi + /api/blog uclari buradan servis edilir).\n'
}

# =============================================================================
geri_al() {
SON=$(ls -t "$KOK"/geri-al-*.sh 2>/dev/null | head -1)
[ -n "${SON:-}" ] || { echo "Geri-alma script'i bulunamadi ($KOK/geri-al-*.sh)"; exit 1; }
echo "Calistiriliyor: $SON"; echo "--- icerik ---"; cat "$SON"; echo "--- uygulaniyor ---"
bash "$SON"
}

# =============================================================================
case "$MOD" in
  teshis)       teshis 2>&1 | tee "$RAPOR" ;;
  ayaga-kaldir) ayaga_kaldir 2>&1 | tee "$RAPOR" ;;
  yazma-dondur) yazma_dondur 2>&1 | tee "$RAPOR" ;;
  geri-al)      geri_al 2>&1 | tee "$RAPOR" ;;
  *) echo "Bilinmeyen mod: $MOD"; echo "Kullanim: sudo bash $0 {teshis|ayaga-kaldir|yazma-dondur|geri-al}"; exit 2 ;;
esac

printf '\n>>> Rapor: %s\n' "$RAPOR"
