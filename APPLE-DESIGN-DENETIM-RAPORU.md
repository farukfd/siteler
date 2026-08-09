# Apple-Design Denetim Raporu — 3 Demo Site

**Tarih:** 9 Ağustos 2026 · **Rubrik:** `.claude/skills/apple-design/SKILL.md` (WWDC *Designing Fluid Interfaces* + *Principles of Great Design* web çevirisi)
**Yöntem:** Site başına 2 mercek (hareket/etkileşim + materyal/tipografi/temeller) paralel denetim; her bulgu ikinci bir doğrulayıcı tarafından dosya+satır kanıtıyla teyit edildi. **34 bulgu onaylandı, 0 ret.** Admin panelleri kapsam dışı.

Önem: **P1** = kullanıcı hisseder, net rubrik ihlali · **P2** = iyileştirme · **P3** = cila.

---

## Üç sitede ORTAK desenler (önce bunlar düzeltilmeli)

| # | Desen | Rubrik | gm | dn | ins |
|---|-------|--------|----|----|-----|
| 1 | **`:active` pointer-down geri bildirimi eksik** — dokunmatikte hover yok; parmak bastığında hiçbir tepki yok | §1 Response | Kartlarda yok (P1) | **Sitede hiç yok** (P1) | `.btn`'de yok (P1) |
| 2 | **`prefers-reduced-transparency` / `prefers-contrast` hiç yok** — buna karşın backdrop-filter yoğun (91/33/47 kullanım) | §14 | P1 | P2 | P3 |
| 3 | **Tipografi px-hakimiyetinde** — kullanıcı OS metin boyutunu büyütünce layout ölçeklenmiyor (gm: 801/843 px; dn: 1278 px vs 8 rem; ins: 437 px) | §15 Dynamic Type | P1 | P3 | P2 |
| 4 | **Overlay/modal girişte animasyonlu, çıkışta sert kesme** — "girdiği yoldan çıkmalı" ilkesi | §7/§12 | P1 | P2 | P1+P2 |
| 5 | **Bar/gauge dolumları `width`/`height` animasyonu** — layout tetikler; `transform:scaleX()` olmalı | §11 | P2 (8 yer) | P2 | — |
| 6 | **Form doğrulama submit-sonrası toast** — inline (alan-düzeyi) değil | §16 Feedback | P2 | — | P2 |

---

## 1) GAYRİMENKUL — 11 bulgu (4×P1, 4×P2, 3×P3)

### P1
- **`:active` yok — en çok dokunulan yüzeylerde** · `css/base.css:384` — `.lcard`, `.ozcard`, `.hcard`, `.bpost`, `.rep-card`, `.pcr-card`, `.ars-card`, `.iq-card`, `.kk-spot`, `.dcard`, `.br-mc` yalnız `:hover`; global `:active` sadece 3 yerde (`.mbar a`, `.kdeal`, `.btn`). Portföy hero CTA'ları `.pf-hbtn` `.btn` sınıfı taşımadığından `.btn:active`'i miras almıyor (index.html:864-865).
  **Fix:** ortak kural — bu sınıflara `:active{transform:scale(.97);transition:transform 100ms ease-out}`.
- **Overlay'lerde çıkış animasyonu yok** · `css/base.css:70` — `.mnav`(slidein)/`.br-page`(brFade)/`.modal .mbox`(fadeUp)/`#saasPortalModal .sp-card`(spIn) girişte keyframe, kapanışta `classList.remove` → anlık `display:none` (app.js:1900 mclose, 1338 brClose, 1819/1855/1899 close*, 5446 closeSaasPortal). Doğru örnek sitede zaten var: `.br-detail` transform-transition ile simetrik (base.css:637-638).
  **Fix:** `.closing` sınıfı + ters animasyon + `animationend`'de display:none; `.br-detail` deseni genelleştirilebilir.
- **`prefers-reduced-transparency`/`prefers-contrast` yok** · `css/base.css` genelinde 29+ backdrop-filter'a karşın iki medya sorgusu 0 sonuç (reduced-motion 5 yerde düzgün var — desen biliniyor, bu ikisi atlanmış).
  **Fix:** rapor sonundaki ortak CSS bloğu.
- **Dynamic Type yok** · `css/base.css:3` — 843 font-size bildiriminin 801'i px, 9 rem/em, 32 clamp. Kök rem ölçeği tanımsız.
  **Fix:** önce 3 gerçek satır-kırpma bölgesi (`.bpost p`, `.man-big-body p`, `.man-side-t`) + nav/kart başlıkları rem'e.

### P2
- **Translucent chrome altında sabit 1px sert çizgi** · `base.css:40` (`header#hdr`), aynı kalıp `:574 .br-hd`, `:1389 .mbar`, `:2587 .ek-nav`, `blog.html:146`. §12 "scroll edge effects, not hard dividers".
  **Fix:** border yerine scroll>0'da beliren shadow/gradient fade.
- **`pfTilt` 1:1 takibi CSS transition'la savaşıyor** · `js/app.js:742` + `base.css:1812` — pointermove her karede yeni hedef, ama `.pf-card` `transition:transform .32s` → tilt imleci gecikmeli kovalıyor.
  **Fix:** pointerenter'da `transition:none`, pointerleave'de geri.
- **Bar dolumları width/height animasyonu** · 8 satır: `base.css:522, 653, 733, 758, 883, 1549, 1654(height), 2433` — IO tetiklemesiyle çoklu bar aynı anda layout thrash.
  **Fix:** `transform:scaleX(var(--w))` + `transform-origin:left`.
- **Form doğrulama yalnız submit'te** · `js/app.js:1796 submitLead` — global toast; input'larda `required`/`aria-invalid` yok.

### P3
- **Küçük başlıklar negatif tracking miras alıyor** · `base.css:5` `h1-h4{letter-spacing:-.02em}` → 13px `.kcol h4` (1629), 14.5px `.ai-tool h4` (1561) override'sız.
- **Blog manşet carousel teleport** · `js/app.js:3516 blogManGo` — `outerHTML` ile tüm blok yeniden inşa, geçiş şansı yok.
- **Kalıcı `will-change`** · `base.css:2427` — `#infoPage .rv*` statik kuralda; JS hiç kaldırmıyor.

---

## 2) DANIŞMAN — 12 bulgu (5×P1, 4×P2, 3×P3)

### P1
- **Sitede tek bir `:active` yok** · `css/base.css:59` — `.btn/.btn-gold/.btn-em/.btn-line`, `.dnqc-btn` (content.js:365), `.nav-links a.lnk`, `.nav-giris` hepsi hover-only. Bonus: "Karar Analizi Başlat" CTA'sı `.btn-primary` sınıfını kullanıyor ama css'te `.btn-primary` kuralı HİÇ yok — o butonda hover bile yok.
  **Fix:** tıklanabilir sınıflara ortak `:active{transform:scale(.97)}` + `.btn-primary` kuralını tanımla.
- **`.vcard` üçlü transition çakışması — tilt fiilen .4s'e düşüyor** · `css/base.css:908` — bare `.vcard{transition:...}` 3 kez tanımlı (138: .4s, 627: transform .16s "3B-tilt", 908: transform .4s). Cascade'de 908 kazanır → mousemove tilt'i (app.js:2305-2316) .16s değil .4s gecikmeli.
  **Fix:** tek kurala birleştir; JS'in yazdığı transform'a transition uygulama, .4s yalnız shadow/border'da kalsın.
- **Giriş yolunda sabit gecikmeler** · `index.html:7` — ov-pre kapısı koşulsuz `setTimeout(2600)`; gerçek kaldırma `js/app.js:554`'te load sonrası ek sabit `setTimeout(480)`. Derin-linkle gelen kullanıcı gerçek render'dan bağımsız bekletiliyor.
  **Fix:** 480ms'i kaldır, overlay DOM'u yazılır yazılmaz rAF ile `ov-pre`'yi kaldır; 2600 sadece güvenlik ağı.
- **Kırık translucent header** · `css/base.css:946` bölgesi — `header.nav` fixed+z-index:400, scrolled durumda blur(14px) ama altındaki içerikle materyal ilişkisi kurulmadan sabit 1px çizgi + opak varyantlar (bkz. P3 sticky-chrome bulgusu ile birleşik).
- **`.ek-nav` sticky ikinci chrome katmanı** · `emlak-ekspertizi.html:340` — `position:sticky;top:0` ana fixed header'ın ALTINA girmiyor, üstüne biniyor; iki translucent katman üst üste (§12 "never stack light translucent surfaces").
  **Fix:** `top:64px` (header yüksekliği) + tek materyal katmanı.

### P2
- **Ekspertiz bar'ları width animasyonu** · `emlak-ekspertizi.html:235` — `.ek-bar .bar-fill{transition:width 1.15s}`, sayfada 6 kullanım. **Fix:** scaleX.
- **`#pageOverlay` sert display-cut** · `css/base.css:319-320` + `js/app.js:925 openPage/939 closePage` — tam-ekran SPA geçişi animasyonsuz; overlay'e enjekte edilen içerik reveal sistemine girmiyor (initReveal yalnız boot'ta, app.js:2271).
  **Fix:** kısa materialize (opacity+scale .28s; reduced-motion'da crossfade).
- **Wayfinding: aktif-nav tutarsız** · `blog.html:99` — hizmetlerimiz/ilanlar/ozel-portfoy sayfalarında aktif link işaretli, blog/diğerlerinde değil; "neredeyim" cevabı sayfadan sayfaya değişiyor.
- **Reduced-transparency yok** · `css/base.css:69` — blur(14px) header, `.adgate` vb. yüzeyler için fallback tanımsız.

### P3
- **Magnetic buton sert snap** · `js/app.js:2289-2292` — mouseleave'de `transform=''` tek karede sıfırlanıyor; `.magnetic`'te (base.css:554) dönüş transition'ı yok.
  **Fix:** yalnız mouseleave'de devreye giren `.3s cubic-bezier(.34,1.56,.64,1)`.
- **Sticky chrome 1px sert bölücüler** · `base.css:69` + `.ek-*` başlıkları — scroll-edge fade yerine sabit çizgi.
- **Dynamic Type** · `base.css:38` — 1278 px vs 8 rem.

---

## 3) İNŞAAT — 11 bulgu (3×P1, 6×P2, 2×P3)

### P1
- **`.btn`'de `:active` yok** · `css/base.css:23` (chrome.css:8'de duplike) — birincil CTA dahil pointer-down tepkisi yok.
- **Modallar materialize olmuyor** · `css/base.css:321-325` — `#teklifModal`, `#gModal`, `#girisModal` display:none↔flex anlık; ne giriş ne çıkış animasyonu (§12 "materialize, don't just fade" — burada fade bile yok).
  **Fix:** opacity+scale(.98→1) çifti, kapanışta simetrik.
- **Dekoratif sonsuz-döngü animasyonlar reduced-motion dışı** · `css/base.css:877` bölgesi — `.hs-gfx/.hp-scene .rise/.pop`, `.bz-r*` döngüleri `@media(prefers-reduced-motion)` bloğunun kapsamında değil; §14 "slow looping oscillations" uyarısına giriyor.

### P2
- **9 tam-sayfa overlay çıkış yolu asimetrik** · `base.css:504,577,645...` — `#pjDetail`, `#projelerPage`, `#hizmetlerPage`, `#svcD`… girişte animasyon, çıkışta kesme.
- **`html{scroll-behavior:smooth}` reduced-motion'suz** · `base.css:15` — vestibüler kullanıcı için tüm anchor scroll'ları hareketli kalıyor.
  **Fix:** `@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}` (tek satır).
- **Chrome hiç translucent değil** · `base.css:4` — `--surface:#181a20` opak; header'lar içerik altına akan materyal değil, opak şerit (§12'nin tam tersi). Koyu kimlik korunarak `rgba(24,26,32,.82)+blur` mümkün.
- **SPA overlay başlıklarında sert bölücü** · `base.css:44` `.pp-hdr` — 1px çizgi, scroll-edge fade yok.
- **Teklif formu inline doğrulamasız** · `js/app-core.js:2037` + `index.html:449-456` — alan-düzeyi kontrol yok.
- **Tipografi px** · `base.css:78` — 437 px bildirimi; ayrıca 4 yerde `letter-spacing:1px` (em değil).

### P3
- **`_totopSmooth` setTimeout ile kare çiziyor** · `js/app-core.js:2022` — rAF değil; kare hızına kilitlenmiyor.
- **Reduced-transparency/contrast yok** · `base.css:1067` civarı — 47 backdrop-filter kullanımına karşın 0 medya sorgusu.

---

## Önerilen uygulama sırası

1. **Dalga A — dokunuş hissi (3 site birden, düşük risk):** ortak `:active` kuralları + dn `.btn-primary` tanımı + ins `scroll-behavior` reduced-motion satırı + dn `.vcard` transition birleştirme. — ✅ **UYGULANDI** (9 Ağu 2026): gm base v68 (12 kart ailesi + .pf-hbtn), dn base v23 (.btn/.dnqc-btn/.nav-links/.nav-giris/.vcard:active + .btn-primary altın-gradyan + tanımsız .btn-blue→zümrüt + .vcard üçlü-transition birleştirildi, tilt artık .16s), ins base v3+chrome v2 (.btn:active her iki kabukta + reduced-motion scroll-behavior:auto). Canlıda styleSheets üzerinden doğrulandı.
2. **Dalga B — erişilebilirlik medya sorguları (3 site):** `prefers-reduced-transparency` + `prefers-contrast` blokları; ins döngü animasyonlarını reduced-motion kapsamına al. — ✅ **UYGULANDI** (9 Ağu 2026): gm base v69 + 18 inline-kabuk sayfası (header#hdr/.mnav/.mbar/.ek-nav/.br-hd donuklaşır, kontrastta 2px çizgi); dn base v24 (header.nav.scrolled→em-deep solid, overlay/kilit yüzeyleri, vcard border güçlendirme); ins base v4 + chrome v3 (mnav/modal/rozetler + 13 dekoratif sonsuz-döngü animasyonu reduced-motion'da durur — .pa-typing işlevsel gösterge olarak bilinçli hariç). Canlıda üç sitede parse + normal-mod regresyonsuzluk doğrulandı.
3. **Dalga C — çıkış animasyonları:** site başına ortak `.closing` deseni (gm 4 overlay ailesi, dn pageOverlay+modallar, ins 9 overlay + 3 modal).
4. **Dalga D — performans cilası:** bar'lar scaleX'e, pfTilt/vcard transition çakışmaları, will-change temizliği, blog manşet crossfade.
5. **Dalga E (ayrı karar):** px→rem tipografi göçü — geniş dokunuşlu, ayrıca planlanmalı.

### Ortak erişilebilirlik bloğu (Dalga B şablonu)
```css
@media (prefers-reduced-transparency: reduce){
  /* site başına: translucent chrome seçicileri */
  .SECICILER{ backdrop-filter:none; background:var(--bg-solid); }
}
@media (prefers-contrast: more){
  :root{ --line: /* koyu-temada açık, açık-temada koyu tam-kontrast çizgi */; }
  .CHROME{ border-bottom-width:2px; }
}
@media (prefers-reduced-motion: reduce){
  html{ scroll-behavior:auto; }
}
```
