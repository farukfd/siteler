# SUNUCU KURTARMA + DİSK I/O — ERİŞİM VE MÜDAHALE SAHA TALİMATI

**Tarih:** 13 Eylül 2026 · **Konu:** (1) `emlakekspertizi.com` DÜŞTÜ (Cloudflare "Host Error") · (2) Layer3/dehost yüksek disk I/O bildirimi
**Durum:** Kurtarma aşaması. Sunucuda henüz HİÇBİR DEĞİŞİKLİK yapılmadı (bu ajan izole konteynerde; komutları sen çalıştıracaksın).

---

## ⚡ ACİL — SIRAYLA YAP (site down)

Cloudflare "Host Error" = **origin (50.114.185.239) yanıt vermiyor.** En olası zincir:
disk %100 dolu → nginx/backend yazamıyor → servis öldü. Ya da sağlayıcı I/O limitini
uyguladı. İki script hazır: `scripts/sunucu-kurtarma.sh` (kurtarma+dondurma) ve
`scripts/sunucu-io-teshis.sh` (detaylı I/O teşhisi).

```bash
# 0) Bağlan (detay §2). İlk kez bağlanıyorsan önce §2'deki ADIM 1-5'i yap.
ssh meridyen

# 1) TEŞHİS — site neden düştü? (salt-okur, hiçbir şey değiştirmez)
sudo bash /root/sunucu-kurtarma.sh teshis
#    → script'i sunucuya koymadıysan, önce §3'teki tek-komutla indir.

# 2) AYAĞA KALDIR — disk alanı açar (LOG SİLMEZ, rotate eder) + nginx/backend başlatır
sudo bash /root/sunucu-kurtarma.sh ayaga-kaldir

# 3) Cloudflare panel → emlakekspertizi.com → Caching → PURGE EVERYTHING

# 4) YAZMA DONDUR — blog haber üretimi HARİÇ periyodik yazmaları durdurur + rapor + geri-al script'i üretir
sudo bash /root/sunucu-kurtarma.sh yazma-dondur

# İSTERSEN geri al (yaptığı her şeyi birebir geri sarar):
sudo bash /root/sunucu-kurtarma.sh geri-al
```

**"Blog haber üretimi hariç tüm yazmaları durdur" nasıl uygulanıyor:**
`yazma-dondur` modu — cron/systemd-timer/yedekleme servislerini durdurur, nginx erişim
logunu tampona alır (silmez), journald'a üst sınır koyar (diske yazımı ve denetimi korur).
**Dokunmadığı beyaz liste:** `blog·haber·news·icerik·content` içeren her birim + `nginx·sshd·
fail2ban·firewalld·gunicorn·uvicorn` (blog haber üretimi ve `/api/blog` uçları bu backend'ten
servis edilir). Durdurulan **her kalem** rapora yazılır ve `/root/geri-al-<zaman>.sh` otomatik üretilir.

> Not: Blog haber üretimi eğer **cron** ile tetikleniyorsa (`yazma-dondur` cron'u tümden durdurur),
> rapordaki cron listesinde blog/haber satırını görünce: `geri-al` ile cron'u geri aç, sonra
> yalnızca **diğer** cron satırlarını elle yorum satırı (#) yap. Script bunu rapor içinde uyarır.

---

**Alt bölüm — I/O uyarısının kökenini (site ayağa kalktıktan sonra) kanıtlamak için:**

---

## 0) ÖNCE DOĞRU TEŞHİS: MAİL NE DİYOR, NE DEMİYOR

| İddia | Gerçek |
|---|---|
| "Virüs var" | ❌ Mailde virüs, malware, güvenlik ihlali **geçmiyor**. |
| "Claude'un eski yeteneklerinden kaynaklı" | ❌ Mailde Claude/AI/ajan **geçmiyor**. |
| "Sunucuda yazma sorunu çıkıyor" | ⚠️ Kısmen: mail **disk okuma (read) oranının sürekli yüksek** olduğunu söylüyor; gövdede şablon artığı olarak "yazma" da geçiyor. Özü: **disk I/O baskısı**. |
| Gerçek talep | ✅ "Bu kullanımın kaynağını teyit edin, azaltın; aksi halde **disk I/O kaynağınıza teknik limit** uygulayabiliriz." |

**Aciliyet seviyesi:** Orta. Veri kaybı/saldırı bildirimi yok. Ama I/O limiti uygulanırsa
site yavaşlar — o yüzden kaynağı **kanıtla** bulup sağlayıcıya bildirmek gerekiyor.

**Mailin kendisi hakkında bir not (oltalama kontrolü):** Mail `info@dehost.com.tr`
adresinden geliyor ve içinde ekran görüntüsü için `prnt.sc` (üçüncü taraf) linki var.
İçerik teknik olarak tutarlı ve hiçbir şifre/erişim talep etmiyor — bu iyi işaret.
Yine de **prnt.sc linkine tıklamadan önce** aynı bildirimin hosting panelinizdeki
destek talepleri (ticket) bölümünde de görünüp görünmediğini doğrulayın. Görünüyorsa
mail gerçektir; görünmüyorsa panelden yeni ticket açıp "bu maili siz mi gönderdiniz"
diye sorun. **Hiçbir koşulda mail üzerinden şifre/SSH anahtarı paylaşmayın.**

---

## 1) SUNUCU KÜNYESİ (repo raporlarından çıkarıldı — teyit edilecek)

| Alan | Değer | Kaynak |
|---|---|---|
| Origin IP | `50.114.185.239` | `FAZ3D-RAPORU.md` satır 2 |
| Web sunucusu | nginx | FAZ3D / FAZ4 |
| Uygulama | gunicorn + UvicornWorker (`tenant_saas_routes.py`) | `FAZ4-RAPORU.md` 4F |
| Önyüz | Cloudflare (origin'e CF-dışı doğrudan 443 erişimi firewall'lu) | `FAZ4-RAPORU.md` 4G |
| SSH portu | **2222** (fail2ban sshd jail'i bu portu izliyor) | `FAZ4-RAPORU.md` 4I |
| root girişi | `PermitRootLogin prohibit-password` → **anahtar zorunlu** | `FAZ4-RAPORU.md` 4I |
| Parola girişi | `PasswordAuthentication yes` (bilinçli açık bırakıldı) | `FAZ4-RAPORU.md` 4I |
| sudo kullanıcı | `e-ZekaAl` (wheel grubunda) | `FAZ4-RAPORU.md` 4I |
| Dağıtım | RHEL ailesi olası (`wheel` grubu) → AlmaLinux/Rocky | çıkarım |

### ⚠️ BAĞLANMADAN ÖNCE OKU — KENDİNİ BANLATMA
Sunucuda **fail2ban aktif**: `maxretry 5 · findtime 10dk · bantime 1 saat`,
ayrıca `MaxAuthTries 3` ve `LoginGraceTime 30sn`.

- Parolayı 5 kez yanlış girersen **IP'n 1 saat banlanır** ve sunucuya hiç giremezsin.
- Bu yüzden **önce anahtarla** bağlanmayı dene. Parolayı rastgele deneme.
- Banlanırsan: 1 saat bekle **veya** hosting panelindeki **KVM/VNC konsolundan** gir
  (`fail2ban-client set sshd unbanip <IP>` ile açarsın).

---

## 2) BAĞLANTI — KOPYALA/YAPIŞTIR (KENDİ BİLGİSAYARINDA ÇALIŞTIR)

> Bu bloklar **senin Mac'inde Terminal'de** çalışır. Ben izole bir konteynerde
> çalışıyorum; bu ortamda `ssh` istemcisi kurulu değil ve dışarı yalnızca HTTPS
> açık — sunucuna **buradan bağlanamam**. Komutları sen çalıştırıp çıktıyı bana
> yapıştıracaksın.

### ADIM 1 — Portu ve erişimi test et (30 saniye)
```bash
# Hangi SSH portu açık, önce onu öğrenelim (parola denemesi YOK, sadece port testi)
for P in 2222 22; do
  printf "Port %s: " "$P"
  nc -z -G 5 -w 5 50.114.185.239 "$P" 2>/dev/null && echo "AÇIK ✅" || echo "kapalı/filtreli ❌"
done
```

### ADIM 2 — Mevcut SSH anahtarın var mı, bak
```bash
ls -la ~/.ssh/id_* 2>/dev/null || echo "Anahtar yok — ADIM 3'e geç"
```

### ADIM 3 — (Anahtar yoksa) yeni anahtar üret
```bash
ssh-keygen -t ed25519 -a 100 -C "faruk-$(date +%Y%m%d)" -f ~/.ssh/id_ed25519_meridyen
# Parola sorulduğunda: güçlü bir passphrase gir (boş bırakma).

# Açık anahtarı ekrana bas — bunu sunucuya ekleyeceğiz:
cat ~/.ssh/id_ed25519_meridyen.pub
```

### ADIM 4 — Anahtarı sunucuya yükle
```bash
# Parola girişi hâlâ açık olduğu için bu çalışmalı.
# DİKKAT: parolayı DOĞRU gir; 5 hata = 1 saat ban.
ssh-copy-id -i ~/.ssh/id_ed25519_meridyen.pub -p 2222 root@50.114.185.239
```

Eğer `ssh-copy-id` yoksa veya çalışmazsa, panelin KVM konsolundan sunucuya girip:
```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh
echo "BURAYA_ADIM_3_TEKI_PUB_ANAHTARI_YAPISTIR" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
restorecon -Rv ~/.ssh 2>/dev/null   # SELinux'lu sistemlerde (AlmaLinux/Rocky) ŞART
```

### ADIM 5 — Kalıcı kısayol tanımla (bir kere yap, ömür boyu kullan)
```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh
cat >> ~/.ssh/config <<'EOF'

Host meridyen
    HostName 50.114.185.239
    Port 2222
    User root
    IdentityFile ~/.ssh/id_ed25519_meridyen
    IdentitiesOnly yes
    ServerAliveInterval 30
    ServerAliveCountMax 6
EOF
chmod 600 ~/.ssh/config
```

Artık bağlanmak için tek kelime yeter:
```bash
ssh meridyen
```

---

## 3) TEŞHİS — KOPYALA/YAPIŞTIR (SUNUCUDA ÇALIŞTIR)

### ⛔ ÖNCE: Mailin verdiği `apt install iotop` komutunu ÇALIŞTIRMA
İki sebep:
1. Sunucu büyük olasılıkla **AlmaLinux/Rocky** (RHEL ailesi) — `apt` orada yok,
   mail şablon olduğu için iki varyantı da göndermiş.
2. **Kurmaya hiç gerek yok.** Hazırladığım script aynı bilgiyi doğrudan
   `/proc/<pid>/io` çekirdek sayaçlarından okuyor. Üretim sunucusuna teşhis için
   paket kurmak gereksiz risktir.

### Tek komut — teşhis raporunu üret
```bash
# Her iki script'i de sunucuya indir (kurtarma + detaylı teşhis):
ssh meridyen 'B=https://raw.githubusercontent.com/farukfd/siteler/claude/admiring-fermi-1m85mi/scripts; \
  curl -fsSL $B/sunucu-kurtarma.sh   -o /root/sunucu-kurtarma.sh; \
  curl -fsSL $B/sunucu-io-teshis.sh  -o /root/sunucu-io-teshis.sh; \
  echo indirildi; ls -la /root/sunucu-*.sh'

# Detaylı I/O teşhisi (60 sn örnekleme):
ssh meridyen 'bash /root/sunucu-io-teshis.sh 60'
```

İnternet erişimi yoksa veya indirmeyi tercih etmiyorsan, script'i kendi makinenden
kopyala (repo klasöründeyken):
```bash
scp -P 2222 scripts/sunucu-io-teshis.sh meridyen:/root/
ssh meridyen 'bash /root/sunucu-io-teshis.sh 60'
```

**Süre:** ~90 saniye (60 sn süreç I/O örneklemesi + 10 sn nginx istek hızı ölçümü).

### Script ne yapar, ne yapmaz

| Yapar (salt-okur) | Yapmaz |
|---|---|
| Süreç bazlı gerçek disk oku/yaz ölçümü (60 sn) | ❌ Paket kurmaz |
| Swap thrashing tespiti (`vmstat si/so`) | ❌ Servis durdurmaz/başlatmaz |
| Disk + inode doluluğu | ❌ Dosya silmez |
| Dev log dosyaları, logrotate durumu | ❌ Config değiştirmez |
| journald hacmi + en çok log üreten unit'ler | ❌ Firewall'a dokunmaz |
| fail2ban istatistikleri + başarısız SSH denemesi sayısı | ❌ Dışarı veri göndermez |
| nginx istek/sn, top IP / yol / User-Agent, durum kodları | |
| cron + systemd timer + yedekleme süreçleri | |
| Rutin güvenlik eleme taraması (madenci imzaları, /tmp exec, silinmiş açık dosyalar) | |

### Raporu bana ulaştır
```bash
# Raporu kendi Mac'ine indir (dosya adını script'in son satırı yazdırır):
scp -P 2222 meridyen:/root/io-teshis-*.txt ~/Desktop/
```
Sonra dosyayı bana yapıştır → kaynağı birlikte kesinleştirip **hedefli** müdahale planı çıkaralım.

---

## 4) EN OLASI SUÇLULAR (bu sunucunun bilinen yapısına göre öncelik sırası)

1. **SSH brute-force baskısı → journald + fail2ban I/O döngüsü.**
   FAZ4 raporu **65.769 birikmiş başarısız giriş denemesi** ve dakikalar içinde
   11 ban kaydetmiş. Bu trafik hem journald'a sürekli **yazar**, hem fail2ban'in
   `systemd-journal` backend'i journal'ı sürekli **okur**. Grafikteki "sürekli,
   uzun süre devam eden okuma" profiline birebir uyar. → Rapor **Bölüm 8 ve 9**.

2. **Swap thrashing (bellek yetersizliği).** "Sürekli yüksek okuma"nın klasik
   sebebi diskteki dosyalar değil, swap'tan sayfa geri okumadır. → Rapor **Bölüm 2**,
   `vmstat` çıktısındaki `si`/`so` sütunları.

3. **Cloudflare HTML'i cache'lemiyor** (`cf-cache-status: DYNAMIC`, FAZ4 4G). Her
   HTML isteği origin'e iniyor → nginx log yazımı + Python backend diskten okuma.
   FAZ4'ün zaten önerdiği **HTML Cache Rule (Edge TTL 5 dk)** hem TTFB'yi hem I/O'yu
   düşürür. → Rapor **Bölüm 10**.

4. **Bot taraması / log şişkinliği.** Tek IP veya tek User-Agent baskınsa. Ayrıca
   logrotate bozuksa tek dosya GB'lara çıkar. → Rapor **Bölüm 7 ve 10**.

5. **Periyodik yedekleme/cron.** Grafikteki tepeler cron saatleriyle örtüşüyorsa
   sebep meşrudur; sağlayıcıya "planlı yedekleme" olarak bildirilir. → **Bölüm 12/13**.

6. **İstenmeyen yazılım (düşük ihtimal, yine de elenir).** Madenci imza taraması,
   `/tmp`+`/dev/shm` çalıştırılabilir dosya kontrolü, beklenmedik dinleyen port
   kontrolü scriptte var. → **Bölüm 15**.

---

## 5) SAĞLAYICIYA CEVAP TASLAĞI (rapor çıktıktan SONRA gönder)

> Merhaba,
>
> Bildiriminiz için teşekkürler. Sunucuda disk I/O kaynağını tespit etmek üzere
> süreç bazlı ölçüm yaptık (`/proc/<pid>/io`, 60 sn örnekleme).
>
> Bulgular: **[BURAYA rapor Bölüm 5'in ilk satırları]**
>
> Uyguladığımız/uygulayacağımız düzenlemeler: **[BURAYA müdahale planı]**
>
> Ölçümü düzenleme sonrası tekrarlayıp sonucu paylaşacağız. Grafik verisini
> (özellikle yükselmenin başladığı tarih/saat aralığını) iletebilirseniz, tarafımızdaki
> cron/deploy kayıtlarıyla birebir eşleştirebiliriz.
>
> İyi çalışmalar.

**Sağlayıcıdan iste:** I/O yükselmesinin **başladığı tarih/saat**. Bu tek bilgi,
şüpheli listesini genelde tek kaleme indirir (bir deploy, bir cron değişikliği veya
bir saldırı dalgasının başlangıcıyla örtüşür).

---

## 6) BU TURDA YAPILMAYANLAR (dürüst liste)

- ❌ Sunucuya **bağlanılmadı**. Bu ajan izole konteynerde çalışıyor; `ssh` istemcisi
  kurulu değil ve dış ağ yalnızca HTTPS proxy üzerinden açık. Bağlantı ve komut
  çalıştırma **kullanıcı tarafından** yapılacak.
- ❌ Sunucu künyesi (IP/port/kullanıcı) **repo raporlarından çıkarıldı**, canlı teyit
  edilmedi. Bölüm 2/ADIM 1 bunu doğrular.
- ❌ Hiçbir düzeltme/optimizasyon uygulanmadı — teşhis öncesi müdahale tahmin olur.
  Müdahale planı rapor geldikten sonra, kanıta dayalı çıkarılacak.
