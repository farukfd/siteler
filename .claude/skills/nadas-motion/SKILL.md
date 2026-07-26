---
name: nadas-motion
description: NADAS sitesine (vanilya, tek-dosya HTML + paylaşımlı core.js, build yok, file:// dostu) zarif scroll animasyonu, scroll-reveal, pürüzsüz scroll veya mikro-etkileşim EKLERKEN/GENİŞLETİRKEN kullan. Onaylı 2026 kütüphaneleri (GSAP 3.15, Motion motion.dev, Lenis) vendored kurar; reveal/stagger/sayaç/SplitText/parallax reçeteleri, değişmez mimari kısıtlar ve tuzaklar. "animasyon ekle", "hareket", "scroll efekti", "fade-in", "premium his", "daha ileri seviye" gibi taleplerde tetiklenir.
---

# NADAS Hareket (Motion) Katmanı — web animasyon yeteneği

NADAS için **2026 standardı** hareket eklerken bu reçeteyi izle. Amaç: ödüllü-site hissi ama **hafif, dürüst, hızlı** kalmak.

## Onaylı kütüphaneler (vetted 2026)
- **GSAP 3.15** — animasyon motoru (ücretsiz GreenSock lisansı, Nisan 2025'ten beri tüm eklentiler dahil). github.com/greensock/GSAP · gsap.com
- **Lenis 1.3.x** — pürüzsüz momentum scroll (MIT, ~4KB). github.com/darkroomengineering/lenis
- **Motion (motion.dev) 12.x** — alternatif hafif motor (MIT, WAAPI tabanlı → gizli sekmede bile ilerler). github.com/motiondivision/motion
- Genel manzara / seçim referansı: cssauthor "Best JavaScript Scroll Animation & Scrollytelling Libraries 2026".

**Hangisi ne için:** Basit reveal + gizli-sekmede-de-çalışma istiyorsan **Motion** (WAAPI). Güç/eklenti (SplitText, MorphSVG, timeline) istiyorsan **GSAP**. Her ikisinde de smooth scroll için **Lenis**. **İkisini birden (Motion+GSAP) yükleme** — tek motor seç.

## Değişmez kısıtlar (NADAS mimarisi)
1. **Yerele indir (vendored)** → `nadas/js/vendor/*.min.js`. **CDN YOK** (file:// + offline).
2. **Klasik UMD/global build** kullan (`window.gsap`, `window.Lenis`). **ES module YOK** — Chrome file://'da module script'leri CORS ile bloklar.
3. Vendor script'leri her sayfada **core.js'ten ÖNCE** (`<script src>` düz), sıra: bağımlılıklar → core.js.
4. Reveal/animasyon **`core.js` `motionInit()`** içinde (tüm sayfalar). Yeni bölüm `<section>` ise otomatik reveal olur (bölümler `#app`'in doğrudan çocukları, `<main>` değil).
5. **`prefers-reduced-motion` → tümüyle atla.** İçeriği **yalnız kütüphane yüklüyse** gizle (ilerici geliştirme; lib gelmezse görünür kalır).
6. **Sticky güvenliği:** reveal'de element'e kalıcı `transform` bırakma → içteki `position:sticky` bozulur. Bitişte `clearProps`/inline temizle. Başlangıçta tercihen yalnız `opacity:0` (transform yok).
7. `core.js` değişince **site geneli sürüm bump** (`core.js?v=N`, tüm HTML'lerde perl ile).

## Kanonik entegrasyon (mevcut durum)
`core.js motionInit()` (boot'ta): **Lenis** pürüzsüz scroll (`gsap.ticker` ile sürülür, `lagSmoothing(0)`) + `#çapa` linkleri `lenis.scrollTo(t,{offset:-70})`. **Reveal:** TETİKLEYİCİ **IntersectionObserver** (threshold 0.12, bir kez), MOTOR **GSAP** `gsap.fromTo(el,{opacity:0,y:24},{opacity:1,y:0,duration:.6,ease:'power2.out',clearProps:'opacity,transform'})`. Bkz. hafıza [[hareket-katmani-motion-lenis]].

## Reçeteler (nasıl eklenir)
- **Section reveal (mevcut):** yukarıdaki IO + `gsap.fromTo`. Yeni bölüm eklemek yeterli.
- **Kart stagger:** ızgara içi çocukları `IntersectionObserver` ile yakala → `gsap.fromTo(cards,{opacity:0,y:16},{opacity:1,y:0,stagger:.06,clearProps:'opacity,transform'})`.
- **Sayı sayacı:** görününce `gsap.to({v:0},{v:hedef,duration:1.4,ease:'power1.out',onUpdate:()=>el.textContent=fmt(this.v)})`. Sonek (M+, 50.000+) biçimlendiriciyle koru.
- **Hero başlık:** GSAP **SplitText** (ücretsiz) ile kelime/harf stagger. Türkçe özel karakterlere dikkat; section-reveal ile çakışmasın (hero'yu reveal listesinden çıkar).
- **Parallax/scrub:** GSAP **ScrollTrigger** — AMA Lenis ile pozisyon/scroll-okuma çakışır; **`ScrollTrigger.scrollerProxy`** ile Lenis'e düzgün bağla, yoksa tetiklenmez.

## Tuzaklar (yaşananlar)
- **ScrollTrigger + Lenis + dinamik-mount** → pozisyonlar yanlış hesaplanır (üst bölümler bile tetiklenmez). Basit reveal için **IntersectionObserver kullan**, ScrollTrigger'ı yalnız scrollerProxy'li kurulumla.
- **Gizli sekmede rAF donar** → GSAP (rAF) animasyonu ilerlemez; DOM-opacity kontrolü 0 gösterir ama **görünür sekmede çalışır**. Doğrulamada **ekran görüntüsü** al (render'ı tetikler) — saf JS opacity kontrolüne güvenme. (Motion/WAAPI gizliyken de ilerler.)
- **file:// ES module** = CORS hatası → yalnız klasik global build.

## Doğrulama
1. `bun build js/core.js --no-bundle` (sözdizimi). 2. Tarayıcıda: `window.gsap`/`window.Lenis` yüklü mü, `NX.lenis` var mı, `html.lenis` sınıfı. 3. **Ekran görüntüsüyle** reveal'ın tamamlandığını gör (üst + derin bölüm + mobil). 4. Sticky (nav/terminal) bozulmadı mı (`getComputedStyle(sec).transform==='none'`). 5. Yatay taşma yok, console temiz, terminal etkileşimi çalışıyor.
