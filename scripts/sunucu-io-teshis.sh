#!/usr/bin/env bash
# =============================================================================
# NADAS-WEB-2030 · SUNUCU DİSK I/O TEŞHİS TOPLAYICISI
# -----------------------------------------------------------------------------
# Amaç : Hosting sağlayıcısının bildirdiği "sürekli yüksek disk I/O" uyarısının
#        kaynağını kanıta dayalı olarak tespit etmek.
# Yapar: Yalnızca OKUR ve rapor üretir.
# YAPMAZ: paket kurmaz, servis durdurmaz/başlatmaz, dosya silmez, config değiştirmez.
#
# Kullanım:
#   sudo bash sunucu-io-teshis.sh            # 20 sn örnekleme
#   sudo bash sunucu-io-teshis.sh 60         # 60 sn örnekleme (daha isabetli)
#
# Çıktı: /root/io-teshis-<tarih>.txt  (yazılamazsa /tmp altına düşer)
# =============================================================================
set -u

ORNEK="${1:-20}"
case "$ORNEK" in ''|*[!0-9]*) echo "Örnekleme süresi sayı olmalı (sn)."; exit 2;; esac

RAPOR="${RAPOR:-/root/io-teshis-$(date +%Y%m%d-%H%M%S).txt}"
[ -w /root ] 2>/dev/null || RAPOR="/tmp/io-teshis-$(date +%Y%m%d-%H%M%S).txt"

# --- yardımcılar -------------------------------------------------------------
bolum() { printf '\n\n===== %s =====\n' "$*"; }
alt()   { printf '\n--- %s ---\n' "$*"; }
var()   { command -v "$1" >/dev/null 2>&1; }
yok()   { printf '  (atlandı: %s bulunamadı)\n' "$1"; }

# /proc/<pid>/io anlık görüntüsü: pid|read_bytes|write_bytes|komut
anlik_goruntu() {
  local p pid rb wb cmd
  for p in /proc/[0-9]*; do
    pid=${p#/proc/}
    [ -r "$p/io" ] || continue
    rb=$(awk '/^read_bytes:/{print $2; exit}'  "$p/io" 2>/dev/null) || continue
    wb=$(awk '/^write_bytes:/{print $2; exit}' "$p/io" 2>/dev/null) || continue
    [ -n "${rb:-}" ] && [ -n "${wb:-}" ] || continue
    cmd=$(tr '\0|' '  ' < "$p/cmdline" 2>/dev/null | cut -c1-90)
    [ -n "${cmd// /}" ] || cmd="[$(cat "$p/comm" 2>/dev/null)]"
    printf '%s|%s|%s|%s\n' "$pid" "$rb" "$wb" "$cmd"
  done
}

topla() {

printf '#############################################################\n'
printf '#  SUNUCU DİSK I/O TEŞHİS RAPORU\n'
printf '#  Üretim zamanı : %s\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')"
printf '#  Örnekleme     : %s saniye\n' "$ORNEK"
printf '#  Çalıştıran    : %s (uid=%s)\n' "$(id -un)" "$(id -u)"
printf '#############################################################\n'
[ "$(id -u)" -eq 0 ] || printf '\n!! UYARI: root değilsiniz. Başka kullanıcıların süreç I/O sayaçları\n!! okunamaz; rapor EKSİK olur. "sudo bash %s" ile tekrar çalıştırın.\n' "$0"

# -----------------------------------------------------------------------------
bolum "1 · SİSTEM KİMLİĞİ"
printf 'Hostname : %s\n' "$(hostname -f 2>/dev/null || hostname)"
printf 'Kernel   : %s\n' "$(uname -sr)"
printf 'Mimari   : %s\n' "$(uname -m)"
if [ -r /etc/os-release ]; then . /etc/os-release; printf 'Dağıtım  : %s\n' "${PRETTY_NAME:-bilinmiyor}"; fi
var systemd-detect-virt && printf 'Sanallaş.: %s\n' "$(systemd-detect-virt 2>/dev/null)"
printf 'Çekirdek sayısı: %s\n' "$(nproc 2>/dev/null || echo '?')"
printf 'Uptime   : %s\n' "$(uptime -p 2>/dev/null || uptime)"

# -----------------------------------------------------------------------------
bolum "2 · YÜK, BELLEK VE SWAP  (I/O'nun 1 numaralı gizli sebebi: swap thrashing)"
alt "Yük ortalaması"
cat /proc/loadavg
alt "Bellek"
free -h 2>/dev/null || free
alt "vmstat 1 5 — 'si/so' sütunları sıfır değilse SWAP OKUMA/YAZMA var (= disk I/O)"
if var vmstat; then vmstat 1 5; else yok vmstat; fi
alt "Swap kullanan ilk 10 süreç"
for p in /proc/[0-9]*; do
  s=$(awk '/^VmSwap:/{print $2; exit}' "$p/status" 2>/dev/null)
  [ -n "${s:-}" ] && [ "$s" -gt 0 ] 2>/dev/null && \
    printf '%10s kB  pid=%-7s %s\n' "$s" "${p#/proc/}" "$(cat "$p/comm" 2>/dev/null)"
done | sort -rn | head -10
[ -r /proc/sys/vm/swappiness ] && printf '\nvm.swappiness = %s\n' "$(cat /proc/sys/vm/swappiness)"

# -----------------------------------------------------------------------------
bolum "3 · DİSK DOLULUĞU VE AYGITLAR"
alt "Kullanım (alan)"
df -hT -x tmpfs -x devtmpfs 2>/dev/null || df -h
alt "Kullanım (inode) — %100 inode, sonsuz hata döngüsü + I/O demektir"
df -i -x tmpfs -x devtmpfs 2>/dev/null || df -i
alt "Blok aygıtlar"
var lsblk && lsblk -o NAME,SIZE,TYPE,MOUNTPOINT,ROTA,SCHED 2>/dev/null || yok lsblk

# -----------------------------------------------------------------------------
bolum "4 · AYGIT SEVİYESİ I/O"
if var iostat; then
  alt "iostat -xz 1 5  (%util ~100 ise disk doymuş; r/s ve rkB/s okuma baskısını gösterir)"
  iostat -xz 1 5
else
  yok "iostat (sysstat paketi)"
  alt "/proc/diskstats farkı (${ORNEK}s) — sütunlar: aygıt okunan_MB yazılan_MB"
  d1=$(mktemp); d2=$(mktemp)
  awk '{print $3, $6, $10}' /proc/diskstats > "$d1"
  sleep "$ORNEK"
  awk '{print $3, $6, $10}' /proc/diskstats > "$d2"
  awk -v s="$ORNEK" 'NR==FNR{r[$1]=$2;w[$1]=$3;next}
       ($1 in r){dr=($2-r[$1])*512/1048576; dw=($3-w[$1])*512/1048576;
                 if(dr>0.01||dw>0.01) printf "%-12s oku=%8.2f MB (%6.2f MB/s)  yaz=%8.2f MB (%6.2f MB/s)\n",$1,dr,dr/s,dw,dw/s}' "$d1" "$d2"
  rm -f "$d1" "$d2"
fi
alt "Kirli (henüz diske yazılmamış) sayfa miktarı"
grep -E '^(Dirty|Writeback):' /proc/meminfo

# -----------------------------------------------------------------------------
bolum "5 · SÜREÇ BAZLI I/O — ${ORNEK} SANİYELİK GERÇEK ÖLÇÜM  ⭐ EN ÖNEMLİ BÖLÜM"
printf 'Not: iotop kurmaya gerek yok; bu ölçüm doğrudan /proc/<pid>/io sayaçlarından.\n'
printf 'read_bytes = gerçekten diskten çekilen bayt (page cache isabetleri hariç).\n'
A=$(mktemp); B=$(mktemp)
anlik_goruntu > "$A"
sleep "$ORNEK"
anlik_goruntu > "$B"
alt "OKUMA'ya göre ilk 20 süreç  [hosting'in şikayet ettiği metrik]"
printf '%9s %9s  %-7s %s\n' 'OKU_MB/s' 'YAZ_MB/s' 'PID' 'KOMUT'
awk -F'|' -v s="$ORNEK" 'NR==FNR{r[$1]=$2;w[$1]=$3;next}
     ($1 in r){dr=($2-r[$1])/s/1048576; dw=($3-w[$1])/s/1048576;
               if(dr>0||dw>0) printf "%9.3f %9.3f  %-7s %s\n",dr,dw,$1,$4}' "$A" "$B" \
  | sort -rn | head -20
alt "YAZMA'ya göre ilk 20 süreç"
printf '%9s %9s  %-7s %s\n' 'YAZ_MB/s' 'OKU_MB/s' 'PID' 'KOMUT'
awk -F'|' -v s="$ORNEK" 'NR==FNR{r[$1]=$2;w[$1]=$3;next}
     ($1 in r){dr=($2-r[$1])/s/1048576; dw=($3-w[$1])/s/1048576;
               if(dr>0||dw>0) printf "%9.3f %9.3f  %-7s %s\n",dw,dr,$1,$4}' "$A" "$B" \
  | sort -rn | head -20
alt "Süreç ömrü boyunca TOPLAM I/O — ilk 15 (uzun süredir okuyan yaramazı yakalar)"
printf '%12s %12s  %-7s %s\n' 'TOPLAM_OKU_MB' 'TOPLAM_YAZ_MB' 'PID' 'KOMUT'
awk -F'|' '{printf "%12.1f %12.1f  %-7s %s\n", $2/1048576, $3/1048576, $1, $4}' "$B" \
  | sort -rn | head -15
rm -f "$A" "$B"

alt "Kesintisiz-uyku (D state) süreçler — disk bekleyenler"
ps -eo state,pid,ppid,etime,comm,args --no-headers 2>/dev/null \
  | awk '$1 ~ /^D/ {print}' | cut -c1-140 | head -20
printf '(boşsa: şu an disk beklemesinde takılı süreç yok)\n'

# -----------------------------------------------------------------------------
bolum "6 · EN ÇOK CPU/BELLEK TÜKETEN SÜREÇLER (bağlam için)"
ps -eo pid,ppid,user,%cpu,%mem,etime,comm,args --sort=-%cpu --no-headers 2>/dev/null \
  | head -15 | cut -c1-150

# -----------------------------------------------------------------------------
bolum "7 · LOG VE DİZİN ŞİŞKİNLİĞİ"
alt "/var altındaki ilk seviye dizin boyutları"
du -xh --max-depth=1 /var 2>/dev/null | sort -h | tail -15
alt "/var/log ayrıntı"
du -xh --max-depth=1 /var/log 2>/dev/null | sort -h | tail -15
alt "100 MB'tan büyük log dosyaları"
find /var/log -xdev -type f -size +100M -printf '%10s bayt  %TY-%Tm-%Td %TH:%TM  %p\n' 2>/dev/null | sort -rn | head -20
printf '(boşsa: dev log dosyası yok)\n'
alt "Son 10 dakikada DEĞİŞEN log dosyaları (aktif yazılanlar)"
find /var/log -xdev -type f -mmin -10 -printf '%TY-%Tm-%Td %TH:%TM  %10s  %p\n' 2>/dev/null | sort | tail -25
alt "logrotate yapılandırması var mı"
ls -la /etc/logrotate.d/ 2>/dev/null | head -30
[ -f /var/lib/logrotate/logrotate.status ] && { alt "logrotate son çalışma"; tail -5 /var/lib/logrotate/logrotate.status; }
[ -f /var/lib/logrotate.status ] && { alt "logrotate son çalışma"; tail -5 /var/lib/logrotate.status; }

# -----------------------------------------------------------------------------
bolum "8 · SYSTEMD-JOURNAL  (fail2ban 'systemd-journal' backend'i journal'ı SÜREKLİ OKUR)"
if var journalctl; then
  alt "Journal disk kullanımı"
  journalctl --disk-usage 2>/dev/null
  alt "Son 1 saatteki journal satır sayısı"
  journalctl --since "-1h" --no-pager -q 2>/dev/null | wc -l
  alt "Son 1 saatte EN ÇOK LOG ÜRETEN unit'ler (ilk 15)"
  journalctl --since "-1h" --no-pager -o json --output-fields=_SYSTEMD_UNIT 2>/dev/null \
    | sed -n 's/.*"_SYSTEMD_UNIT":"\([^"]*\)".*/\1/p' | sort | uniq -c | sort -rn | head -15 \
    || printf '  (bu systemd sürümünde json alan filtresi desteklenmiyor)\n'
  alt "journald ayarı (SystemMaxUse / Storage)"
  grep -vE '^\s*#|^\s*$' /etc/systemd/journald.conf 2>/dev/null || printf '  (tamamı varsayılan)\n'
else
  yok journalctl
fi

# -----------------------------------------------------------------------------
bolum "9 · SSH SALDIRI BASINCI  (brute-force = log yazma + journal okuma = I/O)"
if var fail2ban-client; then
  alt "fail2ban jail listesi"
  fail2ban-client status 2>/dev/null
  for j in $(fail2ban-client status 2>/dev/null | sed -n 's/.*Jail list:\s*//p' | tr ',' ' '); do
    alt "jail: $j"; fail2ban-client status "$j" 2>/dev/null
  done
else
  yok fail2ban-client
fi
alt "Son 1 saatteki başarısız SSH denemesi sayısı"
if var journalctl; then
  journalctl -u sshd -u ssh --since "-1h" --no-pager -q 2>/dev/null \
    | grep -cE 'Failed password|Invalid user|Connection closed by authenticating'
else
  grep -cE 'Failed password|Invalid user' /var/log/secure /var/log/auth.log 2>/dev/null
fi
alt "btmp (başarısız giriş) dosya boyutu ve toplam kayıt"
ls -lh /var/log/btmp 2>/dev/null
var lastb && lastb 2>/dev/null | wc -l
alt "sshd dinlenen port(lar)"
grep -iE '^\s*Port|^\s*ListenAddress' /etc/ssh/sshd_config /etc/ssh/sshd_config.d/*.conf 2>/dev/null

# -----------------------------------------------------------------------------
bolum "10 · WEB KATMANI (nginx)"
if [ -d /var/log/nginx ]; then
  alt "nginx log dosya boyutları"
  ls -lhS /var/log/nginx/ 2>/dev/null | head -20
  ACC=$(ls -S /var/log/nginx/*access*.log 2>/dev/null | head -1)
  if [ -n "${ACC:-}" ]; then
    alt "İstek hızı ölçümü: $ACC (10 sn)"
    c1=$(wc -l < "$ACC"); sleep 10; c2=$(wc -l < "$ACC")
    printf '10 saniyede %s satır  →  ~%s istek/sn  →  ~%s istek/saat\n' \
      "$((c2-c1))" "$(( (c2-c1)/10 ))" "$(( (c2-c1)*360 ))"
    alt "Son 50.000 satırda en çok istek yapan ilk 15 IP"
    tail -50000 "$ACC" | awk '{print $1}' | sort | uniq -c | sort -rn | head -15
    alt "Son 50.000 satırda en çok istenen ilk 15 yol"
    tail -50000 "$ACC" | awk '{print $7}' | sort | uniq -c | sort -rn | head -15
    alt "Son 50.000 satırda en sık 15 User-Agent (bot taraması burada görünür)"
    tail -50000 "$ACC" | awk -F'"' '{print $6}' | sort | uniq -c | sort -rn | head -15
    alt "Durum kodu dağılımı (son 50.000)"
    tail -50000 "$ACC" | awk '{print $9}' | sort | uniq -c | sort -rn | head -10
  fi
  alt "nginx error.log son 30 satır"
  tail -30 /var/log/nginx/error.log 2>/dev/null
else
  printf '  (/var/log/nginx yok)\n'
fi
alt "nginx proxy/fastcgi cache dizinleri (sürekli yazma kaynağı olabilir)"
grep -rhoE '(proxy|fastcgi)_cache_path\s+\S+' /etc/nginx/ 2>/dev/null | sort -u

# -----------------------------------------------------------------------------
bolum "11 · UYGULAMA SERVİSLERİ (gunicorn / uvicorn / python backend)"
var systemctl && systemctl list-units --type=service --state=running --no-pager --no-legend 2>/dev/null | head -40
alt "python/gunicorn/uvicorn süreçleri"
ps -eo pid,user,%cpu,%mem,etime,args --no-headers 2>/dev/null \
  | grep -iE 'gunicorn|uvicorn|python' | grep -v grep | cut -c1-150 | head -20

# -----------------------------------------------------------------------------
bolum "12 · ZAMANLANMIŞ İŞLER  (yedekleme/cron = periyodik I/O tepesi)"
alt "systemd timer'lar"
var systemctl && systemctl list-timers --all --no-pager 2>/dev/null | head -30
alt "root crontab"
crontab -l 2>/dev/null || printf '  (yok)\n'
alt "Tüm kullanıcı crontab'ları"
for f in /var/spool/cron/crontabs/* /var/spool/cron/*; do
  [ -f "$f" ] && { printf '\n## %s\n' "$f"; grep -vE '^\s*#|^\s*$' "$f"; }
done 2>/dev/null
alt "/etc/crontab + /etc/cron.d"
grep -vE '^\s*#|^\s*$' /etc/crontab 2>/dev/null
for f in /etc/cron.d/*; do [ -f "$f" ] && { printf '\n## %s\n' "$f"; grep -vE '^\s*#|^\s*$' "$f"; }; done 2>/dev/null
alt "cron.daily / cron.hourly içerikleri"
ls /etc/cron.hourly /etc/cron.daily 2>/dev/null

# -----------------------------------------------------------------------------
bolum "13 · YEDEKLEME / SENKRON ARAÇLARI (çalışıyor mu?)"
ps -eo pid,user,etime,args --no-headers 2>/dev/null \
  | grep -iE 'restic|borg|duplicity|rclone|rsync|tar |bacula|veeam|acronis|jetbackup|cpanel|cagefs' \
  | grep -v grep | cut -c1-150
printf '(boşsa: şu an aktif yedekleme süreci yok)\n'
alt "Sağlayıcı yedekleme ajanları (kurulu mu)"
for s in jetbackup r1soft idera cpanel plesk acronis; do
  var "$s" && printf '  KURULU: %s\n' "$s"
done
var systemctl && systemctl list-units --no-pager --no-legend 2>/dev/null | grep -iE 'backup|snapshot|r1soft|jetbackup'

# -----------------------------------------------------------------------------
bolum "14 · VERİTABANI"
ps -eo pid,user,%cpu,%mem,args --no-headers 2>/dev/null \
  | grep -iE 'mysqld|mariadb|postgres|mongod|redis' | grep -v grep | cut -c1-150
printf '(boşsa: bu sunucuda veritabanı sunucusu çalışmıyor)\n'
alt "Veri dizini boyutları"
for d in /var/lib/mysql /var/lib/pgsql /var/lib/postgresql /var/lib/mongodb /var/lib/redis; do
  [ -d "$d" ] && du -xsh "$d" 2>/dev/null
done
alt "Slow query log boyutları"
find /var/log /var/lib/mysql -maxdepth 2 -name '*slow*log*' -printf '%10s bayt  %p\n' 2>/dev/null | head

# -----------------------------------------------------------------------------
bolum "15 · RUTİN GÜVENLİK GÖZDEN GEÇİRME (alarm değil, eleme amaçlı)"
alt "Dinlenen portlar"
if var ss; then ss -tulpnH 2>/dev/null | head -40; else netstat -tulpn 2>/dev/null | head -40; fi
alt "/tmp · /dev/shm · /var/tmp içinde ÇALIŞTIRILABİLİR dosyalar (normalde boş olmalı)"
find /tmp /dev/shm /var/tmp -xdev -type f -perm -u+x -printf '%TY-%Tm-%Td %TH:%TM  %10s  %p\n' 2>/dev/null | head -20
printf '(boşsa: temiz)\n'
alt "Bilinen madenci/bot süreç adları taraması"
ps -eo pid,user,args --no-headers 2>/dev/null \
  | grep -iE 'xmrig|kdevtmpfsi|kinsing|minerd|cryptonight|stratum\+tcp|\./[a-z]{6,10}\s*$' \
  | grep -v grep | cut -c1-150
printf '(boşsa: bilinen imza yok)\n'
alt "Silinmiş ama hâlâ AÇIK dosya tutan süreçler (disk boşalmama + I/O sebebi)"
if var lsof; then lsof -nP 2>/dev/null | grep -i deleted | awk '{printf "%-12s %-8s %10s  %s\n",$1,$2,$7,$9}' | sort -k3 -rn | head -15; else yok lsof; fi
alt "Web kökünde son 2 günde değişen dosyalar"
for w in /var/www /usr/share/nginx/html /srv/www; do
  [ -d "$w" ] && find "$w" -xdev -type f -mtime -2 -printf '%TY-%Tm-%Td %TH:%TM  %p\n' 2>/dev/null | head -25
done

# -----------------------------------------------------------------------------
bolum "16 · OKUMA KILAVUZU"
cat <<'YORUM'
Raporu şu sırayla okuyun:

  1) BÖLÜM 5 (süreç bazlı I/O) — suçlu %90 ihtimalle burada, ilk satırdadır.
  2) BÖLÜM 2 vmstat "si/so" — sıfır değilse sorun disk değil BELLEK YETERSİZLİĞİ;
     sunucu swap'a yazıp swap'tan okuyordur. Çözüm: RAM artırımı veya servis
     bellek limitlerinin kısılması. (Klasik "sürekli yüksek okuma" sebebi budur.)
  3) BÖLÜM 9 — başarısız SSH denemesi saatte binlerce ise, saldırı baskısı
     journald yazımı + fail2ban journal okuması olarak I/O'ya dönüşüyordur.
  4) BÖLÜM 10 — istek/sn yüksek ve tek IP/User-Agent baskınsa: bot taraması.
     Cloudflare önde olduğu için origin'e yalnız CF IP'leri gelmeli; başka IP
     varsa origin firewall'u delinmiş demektir.
  5) BÖLÜM 12/13 — I/O grafiğindeki tepeler cron/yedekleme saatleriyle örtüşüyorsa
     sebep periyodik iştir; hosting'e "planlı yedekleme" olarak bildirin.
  6) BÖLÜM 7 — tek bir log dosyası GB'larca ise logrotate bozuk demektir.

Bu rapor sunucuyu DEĞİŞTİRMEZ. Bulgulara göre müdahale ayrı ve bilinçli adımdır.
YORUM

printf '\n\n===== RAPOR SONU =====\n'
printf 'Dosya: %s\n' "$RAPOR"
}

topla 2>&1 | tee "$RAPOR"

printf '\n\n>>> Rapor kaydedildi: %s\n' "$RAPOR"
printf '>>> Boyut: %s\n' "$(du -h "$RAPOR" 2>/dev/null | cut -f1)"
printf '>>> Kendi bilgisayarınıza indirmek için (kendi makinenizde çalıştırın):\n'
printf '>>>   scp -P <SSH_PORT> %s@%s:%s ~/Desktop/\n' "$(id -un)" "$(hostname -I 2>/dev/null | awk '{print $1}')" "$RAPOR"
