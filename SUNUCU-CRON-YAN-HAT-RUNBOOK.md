# Sunucu Runbook — ProX blog "yan hat" cron env düzeltmesi + ek hat (A–D)

> **Kime:** nadas-prod'a SSH erişimi olan yerel Claude Code oturumuna (Mac). Bulut oturumu SSH açamaz.
> **Kural seti:** `nadas-ssh-operations` — silme yok; değişen her dosyanın yanına `.bak_<ts>`; her adım exit code;
> "bitti" yalnız DB/log kanıtıyla. Yerel oturumun izinleri aşağıdaki Deny satırlarıyla sınırlı kalır.
> **Kaynak kanıt:** `prox-emlakekspertizi` `origin/server-wip-20260920` — `backend/prox_news_pipeline.py:44-46`
> (`MONGO_URL`, `DB_NAME`, `DEEPSEEK_API_KEY` yalnız `os.environ`; dotenv YOK), doğru env kalıbı
> `backend/start_uvicorn.sh:4-6` ve `backend/editors/yayinla_saatlik.sh:7-9`.

## 0) Yerel Claude Code izinleri (`~/.claude/settings.json` → `permissions`)

```json
{
  "permissions": {
    "allow": [
      "Bash(ssh -o BatchMode=yes -o ConnectTimeout=25 nadas-prod -- *)",
      "Bash(ssh nadas-prod *)"
    ],
    "deny": [
      "Bash(ssh * rm *)",
      "Bash(ssh * rmdir *)",
      "Bash(ssh * unlink *)",
      "Bash(ssh * truncate *)",
      "Bash(ssh * shred *)",
      "Bash(ssh * git reset --hard*)",
      "Bash(ssh * drop*)"
    ]
  }
}
```

## Kök neden (tek cümle)

Cron'dan `set -a; source .env; set +a` olmadan çağrılan her ProX betiğinde `DEEPSEEK_API_KEY=""` kalır
(`prox_news_pipeline.py:46` varsayılanı) → hat çalışır, log'a hata yazmaz, **içerik üretmez**.

Hatlar ve `scope` değerleri (`blog_posts` koleksiyonunda `scope` alanı; `hat` alanı yoktur):

| Hat | Betik | scope | Pencere |
|---|---|---|---|
| Ana | `backend/prox_news_pipeline.py --generate …` | `mahalle/ilce/il/genel` | 08:00 TR |
| Resmî kaynak | `backend/prox_live_sources.py --run --limit 10` | `resmi` | 14:00 TR |
| SEO trend | `backend/prox_seo_trend.py --run --limit 6` (`--harvest` = kuru koşu) | `seo_trend` | ertesi gün 11:00+ |
| **Ek hat** | `prox_ek_haber_hatti.py --run --limit N` (repoda yok, sunucuda) | rapordaki değer | rapordaki saat |

## Ön keşif (salt-okunur) — A'dan önce, çıktıyı sakla

```sh
ssh -o BatchMode=yes -o ConnectTimeout=25 nadas-prod -- 'set -e; B=/var/www/emlakekspertizi/backend
echo "### crontab"; crontab -l; echo "### cron.d"; ls -la /etc/cron.d/
echo "### dosyalar"; ls -la $B/prox_trend_refresh.sh $B/prox_ek_haber_hatti.py /usr/local/bin/prox_trend_refresh.sh 2>&1
echo "### prox_trend_refresh.sh"; cat $B/prox_trend_refresh.sh 2>/dev/null || cat /usr/local/bin/prox_trend_refresh.sh
echo "### ek hat CLI/scope/env"; grep -nE "add_argument|scope|_kaydet|environ|import prox_news_pipeline" $B/prox_ek_haber_hatti.py | head -40
echo "### env kaynakları (değer yazdırılmaz)"; for f in $B/.env /etc/emlakekspertizi.env; do [ -f "$f" ] && echo "$f: $(grep -c "^DEEPSEEK_API_KEY=" "$f") DEEPSEEK satırı, mod $(stat -c %a "$f")"; done
echo "### set -a kullanan sarmalayıcılar"; grep -lE "^\s*set -a" $B/*.sh $B/editors/*.sh $B/scripts/*.sh 2>/dev/null'
```

Bugünkü üretim sayısı (önce/sonra karşılaştırması için; `published_at`/`created_at` ISO **string** — BSON Date ile `$gte` eşleşmez):

```sh
ssh -o BatchMode=yes nadas-prod -- 'TS=$(TZ=Europe/Istanbul date +%Y-%m-%dT00:00:00); mongosh --quiet emlakekspertizi --eval "db.blog_posts.aggregate([{\$match:{created_at:{\$gte:\"$TS\"}}},{\$group:{_id:{scope:\"\$scope\",status:\"\$status\"},n:{\$sum:1}}},{\$sort:{_id:1}}]).forEach(d=>print(JSON.stringify(d)))"'
```

## A) crontab yedeği + iki yan hat satırına env + ek hat satırı

Değişkenleri ön keşif çıktısına göre doldurun; env dosyası `backend/.env` ise `ENVF` öyle kalsın, `/etc/emlakekspertizi.env` ise değiştirin.

```sh
ssh -o BatchMode=yes nadas-prod -- 'set -e; TS=$(date +%Y%m%d_%H%M%S); B=/var/www/emlakekspertizi/backend; ENVF=$B/.env
EK_SAAT="30 13 * * *"      # ek hat cron saati (UTC) — rapordaki değer; 08:00/11:00/14:00 TR pencereleriyle çakışmasın
EK_LIMIT=2                 # ilk günler düşük; kanıt sonrası artırılır
crontab -l > /root/crontab.bak_$TS; echo "yedek: /root/crontab.bak_$TS"
W="bash -c '"'"'set -a; . '"$ENVF"'; set +a; cd '"$B"' && "
python3 - "$B" "$ENVF" "$EK_SAAT" "$EK_LIMIT" /root/crontab.bak_$TS > /root/crontab.yeni <<'"'"'PY'"'"'
import sys,re
B,ENVF,EK_SAAT,EK_LIMIT,yedek=sys.argv[1:6]
def sar(cmd,log): return "bash -c '"'"'set -a; . %s; set +a; cd %s && venv311/bin/python %s >> %s 2>&1'"'"'" % (ENVF,B,cmd,log)
out=[]; ek_var=False
for s in open(yedek):
    s=s.rstrip("\n")
    if "prox_ek_haber_hatti.py" in s: ek_var=True
    for bet,log in (("prox_live_sources.py","/var/log/prox_live_sources.log"),("prox_seo_trend.py","/var/log/prox_seo_trend.log")):
        if bet in s and "set -a" not in s and not s.lstrip().startswith("#"):
            m=re.match(r"^(\S+\s+\S+\s+\S+\s+\S+\s+\S+)\s+(.*)$",s)
            args=re.search(bet+r"\s+(.*?)(\s*>>.*)?$",m.group(2)).group(1) if m else ""
            s=m.group(1)+" "+sar(bet+" "+args,log) if m else s
    out.append(s)
if not ek_var:
    out.append("%s flock -n /tmp/prox_ek_hat.lock %s" % (EK_SAAT, sar("prox_ek_haber_hatti.py --run --limit %s" % EK_LIMIT, "/var/log/prox_ek_hat.log")))
print("\n".join(out))
PY
echo "### fark (yalnız amaçlanan satırlar değişmeli):"; diff /root/crontab.bak_$TS /root/crontab.yeni || true
echo "### /root/crontab.yeni doğruysa yüklemek için ayrı komut:  crontab /root/crontab.yeni && crontab -l | diff /root/crontab.bak_$TS -"'
```

Fark yalnız (i) iki yan hat satırının `bash -c 'set -a; …'` sarmalanması ve (ii) tek ek hat satırı ise:

```sh
ssh -o BatchMode=yes nadas-prod -- 'crontab /root/crontab.yeni && echo "crontab yüklendi" && crontab -l | grep -nE "prox_(live_sources|seo_trend|ek_haber_hatti)"'
```

## B) `prox_trend_refresh.sh` env düzeltmesi

`cd …/backend` satırından hemen sonra `start_uvicorn.sh` kalıbı eklenir; dosya zaten `set -a` içeriyorsa dokunulmaz.

```sh
ssh -o BatchMode=yes nadas-prod -- 'set -e; F=/var/www/emlakekspertizi/backend/prox_trend_refresh.sh; [ -f "$F" ] || F=/usr/local/bin/prox_trend_refresh.sh; TS=$(date +%Y%m%d_%H%M%S)
if grep -qE "^\s*set -a" "$F"; then echo "zaten set -a var: $F"; else
cp -a "$F" "$F.bak_$TS"; python3 - "$F" <<'"'"'PY'"'"'
import sys,re; p=sys.argv[1]; s=open(p).read()
ek="set -a\n[ -f .env ] && source .env\nset +a\n"
m=re.search(r"^cd [^\n]*backend[^\n]*\n", s, re.M)
s = s[:m.end()]+ek+s[m.end():] if m else s.replace("\n", "\ncd /var/www/emlakekspertizi/backend\n"+ek, 1)
open(p,"w").write(s)
PY
bash -n "$F" && echo "sözdizimi OK · yedek: $F.bak_$TS"; grep -n "set -a" -A2 "$F"; fi'
```

Kuru koşu (trend motoru `--harvest` = hasat+analiz, yazmaz):

```sh
ssh -o BatchMode=yes nadas-prod -- 'cd /var/www/emlakekspertizi/backend && set -a && . .env && set +a && timeout 600 venv311/bin/python prox_seo_trend.py --harvest 2>&1 | tail -15'
```

## C) Ek hat ilk koşu (`--run --limit 2`) + DB doğrulama

```sh
ssh -o BatchMode=yes nadas-prod -- 'TS=$(date +%Y%m%d_%H%M%S); cd /var/www/emlakekspertizi/backend && set -a && . .env && set +a && [ -n "$DEEPSEEK_API_KEY" ] && echo "env OK (anahtar yüklü)" && timeout 900 venv311/bin/python prox_ek_haber_hatti.py --run --limit 2 2>&1 | tee /root/ek_hat_ilk_kosu_$TS.log | tail -25; echo "log: /root/ek_hat_ilk_kosu_$TS.log"'
```

DB kanıtı — ek hattın `scope` değerinde `n ≥ 1`, `quality_score`/`quality_grade` dolu:

```sh
ssh -o BatchMode=yes nadas-prod -- 'TS=$(TZ=Europe/Istanbul date +%Y-%m-%dT00:00:00); mongosh --quiet emlakekspertizi --eval "db.blog_posts.aggregate([{\$match:{created_at:{\$gte:\"$TS\"}}},{\$group:{_id:{scope:\"\$scope\",status:\"\$status\"},n:{\$sum:1},q:{\$avg:\"\$quality_score\"}}},{\$sort:{_id:1}}]).forEach(d=>print(JSON.stringify(d))); print(\"--- son 3 kayıt:\"); db.blog_posts.find({created_at:{\$gte:\"$TS\"}},{title:1,scope:1,status:1,publish_at:1,quality_grade:1,veri_kaynagi:1,_id:0}).sort({created_at:-1}).limit(3).forEach(d=>print(JSON.stringify(d)))"'
```

Trend hattı için ek kanıt (scope bazlı sayılar): `curl -s "https://www.emlakekspertizi.com/api/blog/seo-trend/overview?limit=60"`.

## D) Ertesi sabah kontrol (TR 09:00 sonrası)

```sh
ssh -o BatchMode=yes nadas-prod -- 'for L in /var/log/prox_live_sources.log /var/log/prox_seo_trend.log /var/log/prox_ek_hat.log; do echo "### $L"; [ -f "$L" ] && { tail -5 "$L"; echo "hata/traceback/401: $(grep -ciE "traceback|error|401|api_key" "$L")"; } || echo "(yok — cron henüz koşmadı ya da log yolu farklı)"; done
TS=$(TZ=Europe/Istanbul date -d yesterday +%Y-%m-%dT00:00:00); mongosh --quiet emlakekspertizi --eval "db.blog_posts.aggregate([{\$match:{created_at:{\$gte:\"$TS\"}}},{\$group:{_id:\"\$scope\",n:{\$sum:1}}},{\$sort:{_id:1}}]).forEach(d=>print(JSON.stringify(d)))"
grep -n "DEEPSEEK_DAILY_CAP_USD\|DEEPSEEK_HARD_CAP_USD" /var/www/emlakekspertizi/backend/deepseek_budget.py | head -3'
```

Kabul: her yan hat (`resmi`, `seo_trend`, ek hat scope'u) için dünkü pencerede `n > 0`; loglarda traceback/401 = 0; DeepSeek günlük cap aşılmadı.

## Geri alma (silme yok)

```sh
ssh -o BatchMode=yes nadas-prod -- 'ls -1t /root/crontab.bak_* | head -1'                      # en son yedek
ssh -o BatchMode=yes nadas-prod -- 'crontab /root/crontab.bak_YYYYMMDD_HHMMSS && crontab -l | head -3'
ssh -o BatchMode=yes nadas-prod -- 'F=/var/www/emlakekspertizi/backend/prox_trend_refresh.sh; cp -a "$F.bak_YYYYMMDD_HHMMSS" "$F" && bash -n "$F" && echo geri alındı'
```

## Raporla eşitlenecek alanlar
Ek hat cron saati ve `scope` adı · `prox_trend_refresh.sh` konumu · geçerli env dosyası · yan hat log yolları.
Rapor yapıştırıldığında bu dosya birebir güncellenir (ikinci commit).
