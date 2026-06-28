# CLAUDE.md - Sistem ve Ajan Davranış Kuralları
- Sen en üst düzey Claude Opus modelisin. Web arayüzündeki gibi derin felsefi, mimari ve stratejik düşünme yeteneğine sahipsin.
- Basit/generic kodlar yazmak yerine, her zaman en ileri seviye, temiz ve modern (clean code) standartlarını uygula.
- Bir göreve başlamadan önce arka planda mutlaka "Düşünme Seansı" (Sequential Thinking) yap, sorunun kök nedenini analiz et ve bunu bana üst düzey bir dille açıkla.
- Katı hata döngülerine girme; eğer lokal dosyalar yetersiz kalıyorsa benden internet araması yapmayı veya ek araçlar kullanmayı talep et.

---

# NADAS-WEB-2030

Bu repo, Meridyen markası için **iki ayrı tek-dosya web sitesi** içerir:

- **`insaat.html`** — Meridyen Yapı (kurumsal inşaat: anahtar teslim, kentsel dönüşüm, kat karşılığı, tadilat). Kaynak: `~/Desktop/meridyen-insaat-kurumsal.html`.
- **`gayrimenkul.html`** — Meridyen Gayrimenkul / "Özel Portföy" (satılık & kiralık konut, ofis, arsa; değerleme, bölge analizi, danışmanlık). Kaynak: `~/Desktop/OZELPORT.html`.
- **`index.html`** — iki siteyi bağlayan basit açılış/seçim sayfası.

Yerel önizleme: `python3 -m http.server 8765` → http://localhost:8765/

## gstack

This project uses [gstack](https://github.com/garrytan/gstack).

For **all web browsing / web automation tasks**, use gstack's `/browse` skill.

**Never use `mcp__claude-in-chrome__*` tools.** Route every browsing, scraping,
navigation, screenshot, and form-filling task through `/browse` instead.

### Setup (for teammates)

gstack requires [bun](https://bun.sh). Install gstack once per machine:

```sh
# 1. Install bun (if not already installed)
curl -fsSL https://bun.sh/install | bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"   # add this to your ~/.zshrc

# 2. Clone + set up gstack
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup
```

Run `/gstack-upgrade` anytime to stay current.

### Available gstack skills

- `/office-hours`
- `/plan-ceo-review`
- `/plan-eng-review`
- `/plan-design-review`
- `/design-consultation`
- `/design-shotgun`
- `/design-html`
- `/review`
- `/ship`
- `/land-and-deploy`
- `/canary`
- `/benchmark`
- `/browse`
- `/connect-chrome`
- `/qa`
- `/qa-only`
- `/design-review`
- `/setup-browser-cookies`
- `/setup-deploy`
- `/setup-gbrain`
- `/retro`
- `/investigate`
- `/document-release`
- `/document-generate`
- `/codex`
- `/cso`
- `/autoplan`
- `/plan-devex-review`
- `/devex-review`
- `/careful`
- `/freeze`
- `/guard`
- `/unfreeze`
- `/gstack-upgrade`
- `/learn`
