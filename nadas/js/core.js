/* ============================================================================
   nadas/js/core.js — NADAS merkez sitesi paylaşılan çekirdek
   ----------------------------------------------------------------------------
   Her sayfa (prox, hakkimizda, veri-altyapisi, cozumler, research, iletisim)
   bu dosyayı yükler. Sağladıkları:
   - css(obj): React stil objesi -> CSS string (camelCase->kebab, sayı->px)
   - C: kurumsal palet · EMLAK_LOGO_URI: gerçek emlakekspertizi.com logosu
   - Eyebrow / SectionDivider / SubSection: ortak primitifler (accent’e duyarlı)
   - NX.setAccent(color): sayfa vurgu rengi (prox=violet, diğerleri=primary)
   - NX.boot(render): #app’e bas + saat + çok-alan-adı canonical/OG self-adapt
   - injectBase(): keyframes + body + responsive (tüm nadas-* sınıfları)
   ========================================================================== */
(function () {
  "use strict";

  var UNITLESS = { opacity: 1, fontWeight: 1, zIndex: 1, lineHeight: 1, flex: 1, flexGrow: 1, flexShrink: 1, order: 1, fontVariantNumeric: 1 };
  function kebab(k) { return k.replace(/[A-Z]/g, function (m) { return "-" + m.toLowerCase(); }); }
  function css(o) {
    if (!o) return "";
    var out = "";
    for (var k in o) {
      if (!Object.prototype.hasOwnProperty.call(o, k)) continue;
      var v = o[k];
      if (v == null || v === false) continue;
      if (typeof v === "number" && !UNITLESS[k]) v = v + "px";
      out += kebab(k) + ":" + v + ";";
    }
    return out;
  }
  /* Adı "attr" ama yalnız çift tırnak kaçırmak yetmiyordu: çağrı yerlerinin bir
     kısmı değeri HTML METNİ olarak basıyor (<title>, <span>). Yalnız tırnak
     kaçıran bir fonksiyon orada koruma sağlamaz. Tüm çağrılar düz metin geçiriyor
     — hiçbiri kasıtlı HTML göndermiyor — bu yüzden tam kaçışa yükseltmek
     güvenli ve fonksiyonu her iki bağlamda da doğru kılıyor. */
  function attr(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var C = {
    base: "#06101B", raised: "#0A1626", elev: "#101F35", deep: "#020812",
    primary: "#38BDF8", accent: "#34D399", warn: "#FBBF24", danger: "#F87171",
    violet: "#22D3EE", proxDeep: "#0891B2",
    textPri: "#F1F5F9", textSec: "#CBD5E1", textMut: "#94A3B8", textFaint: "#64748B",
    border: "rgba(255,255,255,0.08)", borderStrong: "rgba(255,255,255,0.14)",
    mono: "'JetBrains Mono','SF Mono',ui-monospace,monospace",
  };

  /* Gerçek emlakekspertizi.com logosu (şeffaf arka plan) */
  var EMLAK_LOGO_URI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AABJz0lEQVR42u3debxVdb3/8ff3u9YezsThAIqKQ1qOmL/Kyq5Z17pYWWjThUZouAZOgY1wm4SG3w+0uupNC7LuL7g/u4GNUjkcU3PKEmcQccIBEJk5895rfb+/P9Y+DIUMnn3OXnvv1/MRWVqHxZo+7+93fQdjD79KAACgvlhOAQAABAAAAEAAAAAABAAAAEAAAAAABAAAAEAAAAAABAAAAEAAAAAABAAAAEAAAAAABAAAAEAAAAAABAAAAEAAAAAABAAAAEAAAAAABAAAAAgAAACAAAAAAAgAAACAAAAAAAgAAACAAAAAAAgAAACAAAAAAAgAAACAAAAAAAgAAACAAAAAAAgAAACAAAAAAAgAAACAAAAAAAgAAAAQAAAAAAEAAAAQAAAAAAEAAAAQAAAAAAEAAAAQAAAAAAEAAAAQAAAAAAEAAAAQAAAAAAEgXQynAABQpUJOwW6KupGMMTKlv0qSd17eS14++e9epf/0d/9/UgGIq8DQ3t1m1/+8/b3tvZyTpOT9DQLAbm8ea42MjKLYyRWdFLlxKroTFLmjZEyvMnaZArtWgWmXKb1Pd1ftHXcZUsaXEitQq5wfV7rX84rdISq6EyRJ2WCpssFCE1qFYfK+di4JBqjjAGAk2SC5IYoFp7inOEWxO1gt2dkjRuTnHHn4sBlHHzlcY0Y3avQBTWprzWlYc0YNDaECaxQEVpmM+YdugELRyRECkKJwGzupWIw5GajZfFsoOHmftPI7OgvavLVPGzf3avnjm/Xwio1z1qzrGlPc0jdNktQQXhFkAgXWKHa+rsOAsYdfVWcvRKPAGhUjJ99dnCSvhmGjG/Xmkw+a98+nHqJTXjNaJx0/Sq3Dsgos3aYAUM26eyItf3yz7lr6gu7821r9+Z417S+s7jxDvdHFaszMDnNBEpTj+gsCdRMAjDGyVir2xVJX8eKwLT973Klj/Afe80q9++1HaMxBTf/w/3HeJ615n3QZmL//jmpeIo4CACrSG9D/vd8YKbD2H77UbtnWpz//ZY2W3PyMrr/12TXPPbXlInnlbXNmYWCNnKuf8QI1HwCS7/tWxb5I6ommjX7FsHEffd8xZ330fcfo9ScdsOPG8VIcOxlrZEt3DAP6AKDKQ4HvHwzoZYMd73dJ2tZZ0JL2Vbr6/y3XLXevNuqOppnmzBVhaOuiR6CmA0AQGMWRl+sozDjw8JaTL/jUSROmfOwEHXRA446i75wCa7aPGgUA1HYgcM5LRrt85v3Tnc/r6p8/ql9d/5Tp29Q7LRiWvcIYU9NjumoyAGzv7t9amJIZlp1//uQT/RemvkaHHdIsKfnW0z/yHwBQ32EgCHbUgvseWa9Lf/SA/ufXK40iNy7TlG2PY0cAqJZWf7EvlnqjKe9811HzZn/xFJ3y2gO3F35rDV37AIBdxM4ns8NKDcP2O57XzG/fpaX3rJ0ZtmbnqgZ7A2oqAASBVXFL77QDxzSfNvvLp0w4d9KJ2y+s3WlxCAAAdqe/yFtr1N0T6euX3KPv/+h+I2uUyQU1NTYgMK3vqf4UY4wCIxW39U05411HXblo/rvGvuv0w+VK80L5xg8A2Nd6YoxRHHvlsoHeefrheu2rD5h1y+3Pn7xtU08UNmSW+xrpCaj6AGCMkZxX1BON//qMU6756fffrlEj8opiT+EHALws1prtYwSOP7pN73nnK46958H1E55/fFNv2Ji5sxamClZ1ADBWkvOKC05Xfvdtj335vNftaPUHFH4AwEAamEkQiGKn0SMb9eH3Hq0nnu8Y98jSF3rDhsydBIAKXhgjKe6Jx1/53bc9dv6kExXHTtZYRvcDAMraGxDHXg35UBPPepU2dxfH3X3H6rVBLlxazftsVWUA6B+pGXUUplzynbdec9GnT1IUO4WBZYQ/AGBQQkCyb4DRmW8/QkE+OOvm9lVPBdngoWoNAVUZAAJrVNzce/HMGW/63jcuer3i2CsILBueAgAGr/FZamE673X6P41RrjHz/ptuWLU2zAVV2RNQdQEgCKyKW/umXXjhyXO/9403M7cfADCEISAJAi72euubDpGy9qw/ta9aGzaES6ttYGBVBYAgtCpu7p3xsUljv3f1pW9L5vdT/AEAQxkCSr0Bznm9/dQx2tBZPOsvf36+NDugelJA1QSAIDAqbitMeuOpY668dt47FYbJ935L9QcAVKonwHmdefphuvvh9eMeX77xqbAh81C1hABbFQdpjaLeSKPHtEz4+VXvUFNjRt5T/AEAlQ4Byafpn3z37TpwTPNZcV9UNbXJVsMJlvcyXvqvy//lrKMOH6Yodrvs4gQAQKUaqHHsddghzfrerNMmuL54UrUMCLTVcHKjrYUZX7jwZH/m6Ydvn+4HAEAaBKUQ8PH3H6P3nPWqBdG2wpQgTH+dSvURWmtU7IrGjX3d6DmzPv+GZNtGWv4AgDQpfQqQpEu/8iY1tuWecsU49QPUUx0AvPcyVu3fv/jNamwI5T07+gEA0tlgjWOn448eoXM/8eqb4o7CjLSvSpvaABAEVnFHYcrZ73mlf8dbD0ta/6zvDwBIa0eASTYQ+tK5r9EBh7eeEPXFqV6aPrUBII6dwsbs/H+/4HVJbwD3FgAg5b0AzjsddECjzp08drLvjmakudc6lQEgCIxcZ2HKGW8/3J/y2tFynm//AIAq6AVQ0gtw3sfHqu3Q5nxUiFI7FiCVAcB7SdZuPufDx0uSnOOmAgBUSS+A8zp4dJM+cvbRs3xXcUaQ0plrNo0nL+qJdMyJIxe9++1HbO8RAACgKnoBTPLZeurHxyrbmp8bRelsxaYuABhrpN7o4o+992jlc4Hi2LPLHwCgqnoB5L1OOn6k3v7WQ73rLExJYy9Aqo7ISIqKTvmRDbMnnvWq7UkKAIBqEsde3ksfPvtVkjE9adwfIFUBwAZGvrs46dQ3HOSPe2WbvPeyDP4DAFRbL0CQbFj3rtOP0IhDmsdGKVwYKHU9AIrdIe9462HbExQAAFUXAEyymN3oUQ069eSDZqgnmpK2Bm16AoCRirGXbcnNPf2fxiR/i/5/AECVimMvL+nUk0dLsT9YIgC8ZOvfR06jD2i4/YRjRiQHR/c/AKBKGWtkJL3+pANlmjOz45TNaU9NALDGSIV4wquPG3laS1OGOwcAUNVsqRf7xONGqrklN8lFPlXjANLTA2CNVIhPPvrI4ZKSrhO+AAAAqt3oUQ161SuGLVAxHpemT9vpmphoTM+Rh7VIkpxnACAAoHoZIzmXzGY78diRUiE+mQCwG855KR/MPmxMEgAszX8AQJVzLmnMHnNkqxT7g/kE8BInyWQCjWzLlaITNw4AoNq7AZK/jDmoWcqGS9O0IFAqAoApzZcMw0AjWvPUfwBAjdT/pJq1tmaljFnY3yNAANhJsgGglMsG3DEAgJoSBjZ1Ldv0DAL0SU9AGNL2BwDUWk/Ajn8nAOzuBFmjMLRK4XkCAGAA9S19x5S2vQDGMfgfAFB7PQDpK24hl6U8WLYAAIaomNJQJABwQwIAqqKRqPS1EsN0nSC1V2NLuhg59fREyXRG7nMAKH8jS0lPaxhaNTbQdqUHoMKi2CkMrK79/ZM693M3Tw2asgd753s5MwBQXtaatqir8NRb3nrYvCX/9z39jUbGixMAKqtQjLVtc2+bIjdbjj4AACh7D4A18h2FGR2dRU5GrQaAaiyfxhiZjF0WhlaOAAAAZRdYo2LGLmOtmFoNAF5VO5zeezV4z2wAABikd+z29yzKw3IKAAAgAKSiEwAAANRbDwAJAABQY9L46YJPAAAA0ANATwAAAAQAAABAAAAAAASAQcEcTwAA6AEAAAC1HgBo/AMAahLTAAEAAAGAXgAAACqCzYAAoNqkbUM8Xtv7eIrSdaJCLgsAVFkxiVJWS6xk+KBMDwBBEgAGV6ZVU2xWJ8urp+IHY9QQdWmq61X6eiZADwAA1Ezr30nHz/LzRr5Fijor2/L2sZRplVbO0ZTn/q+ZHgzXFT7mGhEAXm77ny4AANijICeFTckrs9IBIGySTEaSVwNXhgAAABjUwmvki6WxABUOAKkbjwACAADULPN3vyp9HKhKrAMAAAA9AACAquB3+lXPx1BN14seAAAAQAD4+4DESoAAgJrrAEjfLDc+AQBA1WEtYNRgAOA2AoB9eFGmaQwAqhJjAAAAIADQBQAAQD3UNsYAAEA1FhOmAaKmAgBbAQDAPtZdU/H35a71n7d3tWEMAAAAQxCWCAAAAKDiGAMAANXapGQaIGqqB4CVAAEAqKMAwJaSAICal55ix0qAAFBtvCn9UkqmAfLmpgcAAAAQAAAAAAEAAIC6lMaPJGHqThCfkgBg7y9LpgGilgIAAGBfGKVr6pQhCVSh1H0C4BYCANScFM6UoAcAAKqumIhPAKi9HgDmkwIAUI8BAAAADLrUfALoH85C+x8A9uWNyfrpqJEAAADYD2kaA0DLrSrZVN7QAACgjgIAAAAYEuwGCADVhmmAoAcAAIAqyGwpDEoMAgSAqmQ4FtRSD4BnHSAAAOgBAADspq3ENEDUVg+A3+nfAQAAPQAAgJQ1vHc9Bi/GAuxTK5cAAAB4uVgKGAQAAKjvLgDWAcDLxDoAAAAQAFIQbEmTAAAMOj4BAEC1YRpg9V0yVgIEgKEXBEbGmHQUKiN57xXHfmA/JDWDABmQSA8AAKRUcWthimJ3cHrevPYp25RZyJUBAWB7igSA8vFeskZ6/weOmXfQgY2KIidjKns8YWi15oUuXde+igAAAgAAlL1JYZKCa4zRt770Ro09ZkRqju2BZRt0XfuqXY5z/9OE0jUN0KiHu44AMKCbiVkAAMqts6uoOPZy3svaynUBOOdljVFnV5GLUnfSV9zoAQBQ86w1yUBAp4oGAFM6loEfQ9oGAYIeAADA0DQmmQaIgQZjTgEAYEAhAAQAAABAAHiZYZI4CQDAYGMMAABUG3YDrMpLRgAAAJQBSwFjYFL1CcCnNSYBAFBj6AEAyiAI0tUCcs6zqFYtYxpgdV4zJX0laTldYUrPEVA9z7WXilv7psgrn5qDagyvsKHlgQJADwAwKMXfeeVygb4x4y3zWpuz8sni8xU/rv/8r4cvf+yxjSbIBfQE1Kw0tSVBAKALAPX0+jWS81ImYyd97pz/pXwuSM2xLWlfpcceWT/J5sOFMQmgRos/SwGDHgCgspnVq3fD5h4dNKpR3nuZCvUA+J1exYWik4x6uTq1fOMpHd/fyZdVe5oYAwCU40EKrMLQpiYAGBplAPaCpYABAKjHhkv6Dok+AADY62uSaYCovQAAANhz3TWlX2nIIYb6X6Vsyu5qkiQAAHUXAAAAwJBgFgAAVCN2AwQ9AAAApD2wpS8psRsgAAB1iE8AAFB10rYUMCtPEQDKUv6JAACwT69KxgBU1SVLm9SNAWDfEgAA6jAAAABQk10A3o9L0yGxEiAAVGUxEUsBgwAAAPUXAtI0CBDViDEAAAAMdm0jAAAAUMdS1GHCJwAAqMbmJNMAUVM9ANxIAADUXw8AYRIA9gUrAaLGAgAAYD9bTEwDRNUHgFKA9M7LeS/n0n9HOZ8cKzMXAGBo371K/pX6vgfnvYyXnCMA7FU2a2WNkQ3T36WUtUHy1wyTKQBgKFhrZI2pmq8O1prU1olUBADvd1zLp57t0Mi2vIpFt/3EpVUUezXkAz2/tksypodHEwAGqU5IkjE9Xd1FPbFq6/a/l/YcEMde+Xyg59Z2Ssa0p6nHOHU9AJMvajeBNeO8V3s13JTGaFwU+3bbEFbFZwsAtVANTemXUjAGYGhKsHNetiFccu+D681JZ/yiqoKL7a8TuUA+RQkgdQGgrxBLVVL8S9qNkYxhFCwADHqL2ntFvVG1HXYq60TqAkBgq6+QMggQAIaGkWQD6kRNBgCKKQDs7UWpup4GSJ0oD4avAwBQh1gICACquBOg3o8BBAAAqCMsBQwCAADUb/Of3QAxAIwBAACAAAAAAOoBnwAAoBrxCQAEAACoRyZdx2HUyzWpLnwCAACAAAAAAOpBKvcCMKZ6PisZGTnv2QkQwNCp86WAqRM1GgCKnYUJivxRMuqpjgfRNygbLLUNYTuDYQCAOrHbOpEJltmGcAkBYA/e8c4jFx10QKOiyKV+i13vvbKZQCuf3qK7/7bW2NCySQWAIWlTpm4Q4JC9d6VxZ7xi0ZjRTSpWSZ3IZAI9+cxW3XnPWmNDk5o6kYoAYIzkfHIb/Z8Zb9LrXn1AVT2K//O7x3XXHc9PMJlgsScBAMCgxAxfKqjf/MIb9U8nH1RVx//r65/WHXc8P85kMu1pqRPp6QHwyRXu7YvlXPKtxNp0J7sodgoDq76C4+l8Odc7bW8XoJqenzpeB6C3L5JzXrHzClJeJ+LYKwiM+gpx6o4tdZ8AjDXbC3/aA4D1ybEaisfLOHkEEgAvs06Y5N3rq6BOeJ8cozWSjEnVWLFUBQD2lKrxhzaQ4q2acvAEP++IyVKxQzI2BTedk1Z8W+p63BiTIwwAGIzGbfqOKV09AFT/Gn8CJEU6Kn+QNOIUo75Nkg0qf0wulmyTT5K6EQM5kX51Pg2wel+ABADU80vLqMcXjaIuKe6WXAoCgI8lxaRPUFBe3nNN3+3+XK00ZaX0jQHgPqqPh8Hs+FXxp5J7DkAd1jZ6AFC5VkNaug592nI5gNrtAyAA0ANQz7Xf7/iVhrrLN39U54MktgOuItamLwOkLADQH1svSdin7jrzFtvlCgUpuzqOS1QdiYT3dzVJ3zRA7h9aL9T+iou3aopiHZyKPd698qZRs02Wa5XOxhIv7X07TXwCAEqFP21jAAzVpf9cBNIhEzUvM7w0Q6LS700rbfizpnSv0hhCwG4CNNMAqyaypa3FEab3JAEY8ofPJd3/R54vtRwjub4KP5Reslnp/vN1SNdjmmLzmu9jLhWqOQDQA4B6fxTS1gNAC2YX0TapuCU9AcAXJRn1cJ1QtW89YxgEuNeIRBdA7UtL9+XOx4NdH0VrZGxp+dIKB4DkGLhIqPYAQA/APmQAEkDd9AKgOkIax5G+y+NN6Vdlz00ynTeNs3rS+spL13kK03mSQIGhB6CSz98uazVU+NqwTgNo89RLAAABgABQ+XORljEauxwDFwrVK4WbATILAJW6ylxpoCwBmpUAq+e9xyDAvRR/6gIvL15ilU/gqesB4AKhyh8tPgHsy/uHBFD71V+pGMC0/YioLXsOaRxHSpMaKwESAGosAKDm31u9okFXBRktjWMAgGoOACwFvNcgyV4A9VBgjORtaZh5WgoeqiY8YtdwxFLAqP4AwE5SvLwIAGkJ4rvs15CKHgD2akANvfsIAC/x7iED1FGVQXrDmWEMAFBGtrQUcJpu5RSOAaAw1FXrn90A0x8CUtEDgFQ+Q/33CfaxtLESIKUffALg8nB5auaNyboe+3SWmAWw9xuJTwD18uLiQqc7ARh6AIAy5rQ0TnFnGiAq27xkISC6AKrhOIAaxFLAqGALU/Qxp7nZkrpZAEhdiCag7fsTZdN3G1suCwAA9de4TU0PwPaQT9Cv/cZLSvYy33E8XJN/PCmMAUh/OWEp4GpNAGmZc8QnAFT2xc4nAK7PPgcAFgsDPQA1HQDA44CU9ADIMAiQkLYfAQ3V9s5LXwBgHmB9vbiYBZDu6wSgZtEDgMq1MPkEkO7r4xgDANRy25YxAOAqc+f9Y931O35VOgCk4jhSGaBNepYC5vrQAwDsd8suTT0AhkFmu54T1gEAarmdkb69AHjO66T48wkg9W8qzgtQvifKpG8xYHoAALxEMGIMAFC+AJC+YyIAVIn+vaQr/jI2kvf+5X+TNerZZZlZegBSWvzFXgDVcn3SMg3QqIcLs/cXIAGgak5PSp51L0WFKD0vnsDIhnZgPyOt0wApNDu1/ukBSG/9N6Vfabg8LOFaregBSH3x98pkAh3ximHeWlPhY5GslbZ2FO944cWut5gB9Gl5b1LzXqe+vFQUNyk7HoC2f20GgO3dSDzo/awxigqxDj2s1d/7+wnK54Kk671CpyiOvcLQ6JrfPH7apy64aXzQlFninH/515tPAGluYqZwKWCk7hpxffYjAbASIF7mfZPPh8pmKrt5o/OSNVImE5Sh4KbtYSB47nqNUvYJgCJDcEXtBwBewy/d+vZh0g1vKtgDYAIjX45VWVzpl0nBDee4v/6hoNADAJS1pvEJYF/OFAngJXsB+gt/pQLAzsdA1Kv1V1Y6BpnR0EUtPVaGhYBAS9MwBqBaegTS1APANLO/Oy8sBVxdjTjGANAu5M2164udAJDOa+QleVv5Rfj5BIDa6QDY9b+k4L5O4VLARIA6fByQ1tZ/GnoACGmoiR6AHbdyWt5+9ACgssUlbQsBYacn0aTnfuHNkM5niGdnPwJA+hJAygKA4Tmvl+LCUsD0AOzrcTBLAzXUC5Cmra0ZBAjgJQJaWtYBoFWw22uUmtYS07eqFZ8AMPTvdC95b+W9S0Xr29MDkO4eAIleGtRE658AAKSpwFBc0t+qowdgz8+P5zkmANRCADBiFgAFBmkrMvV+DEDZEoBJ1Q3NJwBU5iozCyDdtd+b0q/KXxvvCYuofjaFd3H61gFA/bQs+QRQHdeI40hpiE7RSoC7vMW5WNUifT0ApID6eYGx3zzXh2tTG2ER+1bc2AuAZ77O60pv6lp2vMDS3wMA1ECkpgcA6P+mm5ZNRCgwL1F407QOAC0CVHkAsASAvZ8knvP6KTCojl4AegDSe22YBkgvAD0AqDqOHoB0FxjGAADlvYvZDnjvzzldALRekK5rxHGktC3JUsBVdcVSeJpYBwAVucq+9CsttQ67eRLZCwAobwDYflOn457mEwBo2TlSwB6vUb0fQ9qfH7YDBgEA1fXyYgxAqi+R7++lScPlMfQCoBb6ABgEuOfTo3EMAUDF7j7svoVJD0BKL4+Rr/DJYYjGfrxhTPreM/QAgDcHdnN9GAOQ/ucnBddo+14NOx0XqgYBAEPfyu5/cYlPAAQ0giLq6u1HANjzSSLtgwCQjtdV2tYB8OJTDar2iUpRmye9PQA833VSdFM0CBB7bn2n5Rj695EAqjIAsBAQwEJABLT9vFdYaCa1zxDPcVU3blkICBW6yiY9V5yXV3pf7BSYvTxDJiXHgmo8U3wCAC92FgLaS0jjpQDU4l3MJwBUpv57k0wfSsEUr51zCDkgpT0ASOc14vrsRwIwqXvJEABAJsZuAlp/SKt8kUtWJQRQ0wHAGJPvnwZIaajhZkvaBgFSXegBAIaiucNugHg5nPNyzsv7yu2Y7JyXM5IfSLPQqEdekjPJt/dKPxFGpTEApmcgh7Lj+viKXZ+dZ8kPuGZ6k1yjGlkJ0Hm//RpV+jnuP54BX5+UrAQoz14N9ABg8GqUMWpsqPylytrkIc9lg4H9eQIjm7OyfV7GVj4AeCfJqGEgP6axIZS16Rk4FwzwvNqMkc2YnZoulSswNmMGHKoacsn1sRW+3/p//4bcwJ5nExrZrJGNjIyt4OVxks2ayj/H1fAet+k7pvRNA+Q+2undlzT3+/qiNffcv+6QfDaQq2APQBx75XNWjz+9VbJmyX43YryXrNlc2BKrY2Wvit0uHQ+Fl1yfu+NlnVcjOec33/vgeh0wskHOuYot+LFzD8C2joJkzeaX1Th0UtezBbleLxf5ygeA0KjY5SVj2vfnnuv/33p5PfToRhlJxchVNAQ455UJrR5+bOM/HOf+3HM9awvqaAkU9zmpwgEgbLAqboskq818r9nTZWM3wH26ubFTvcxYrV7XNeYtH/h1Ks6NMUbOedlcsN+fAryTbINd8uI9HWb9XzvSda5d0qrSfhYYa416++L2d09eYkyKFjZ0zsvmw/3v8jaSd14rr16XqreVd5LN7f8JNia5Tp/6wp+MNZXfPS/J9GZAnwCMkVYt2pCu6+Ml22CT3jTsobaxGyD1/2WIYq80rIXu5ZIkawb0Q9L3ojC1cX36T/BAeyFq7frEsVcsl5LrkxzHQC6R96Ufw4u7euo/KwFyJ71c1qbl3JRpapjh+qT6GtXa9TFpegPzDNVnB4BhFsCeWoVpTUmpOD18WuP6YGCvF64RKtwDkLbylq5xiRR/AEBtNf1T27i1XB0AAAa7ByB9XQCpCgBGauATAAAA9AAAAIB6CAD0AAAAak3pC8A4AgAAACAA/F1O4qoAAGqrByCFtY1PAAAA1GHblk8AAADUYeOWAAAAQB0KOQVlS3c9xvAJYyix/C6A1NeG7X81MsbkCQA1WIh85I+KYi/vqEqDf8KTp6qS+7oPhiAwsiRI4CULqVey1bWpwufEpLC/nQBQjpMYGjU0Za4IGzOTnPObOSOD/CAZNcSxX9xXiGvmz2StUXFrYYoK0clcYWAPYn9woQqf/TRGFgLAQE5ekES6973zKL31nkme/v/B52KvXC7Qzbc/r49Pazc2qO5zboxkjVFxa9+0s9539OWvP+nAUguHaw3srgfAe+noI1u3Pz8gAFRUU0OopoYWTsQQOmh0k7Z/C6ja4m9kjVTc0jtj6tTXzPnRnNO5sMB+4JNZjQWAahzY5av1wKtQHHsFgVGx6Kr7xWWNXOxU7IkmfPXf/2nOt798ipz3iiJa/8BeC1dgqnIcAAGgBpmkOceJGJJWc9JyrubTHQRGxb5YoZGu/I9/WXTux8cqdl7WGGUz3EcAhqghwikAhrLlYlXsKo4b0ZKd8+ufjffnfnys4jgp/mRIAPXbA+ClmGl0qNWHLbQqbOmbctQxbfOuvfpMvXbsKEWxVxhQ+YHax14Aezw3UewXd/cUkyxADkBNFX+jwsaei//ptDHzbvnl+/XasaMUU/yBulGIYnmvXgLA7uq/MYqdU1d3xJ2C2sn8xiiwRoVNvTM+/JETZt14zdk6/JDm7YMZAdS2/sbslq19KhTj9jR96ktHACidoCjy6uwqcsegJlhrJO9V7ChM+uIX3jjn5z98h5qbMnKO4g/UWwBY80KXor5Y1pjU9HCnIgB4SdZKvhhr/caeXU4aUI2CwCgqxvJFp8suOX3BpV87Vd55ee9rbgljAHsKAEkxe+rZbVJPcUYQpufLe2qOJAis1BNd/Oyazl1OGlBtwsCq2B2ptTEz7Zf/9W4//dMnKY69ZJi7DNSb/sD/8IqNkhebAe0hKjU8uWqrJPGiRHUW/9CqsKV3ylFHj5j3i/nv0utPOkBR5BWG3M9A3bX+SwHAea8Hlm2UcsGdLkUz3VLTA+Ccl3LhHQ8s3yDvS99I6QRAVRV/o8KmnhmnnDpm3p+ufV9S/GOKP1C3SguWrn6hSyue3DxR2aA9Tb3bqQkA3nspa5c8tGLj1Bc39u587oBU23mk/wf+9bg5N15zto44tEVx7JjmB9Sx2CdV7K57X1Dnpt6eMLSpGt+WntEIXgrCQNs2981f+vD65G+xKBBSbvtI/22FKV/43Bvn/PLH79KwlmxppD8LbQJ13Tgo/fXue1+Q+qLT0rZ5UXp6AJSMnFZXcc5flr6w428CKRUERlEhlis6XXbp6fO++41T5b0Y6Q+gVNOs4tjpT3etlhrCmS5lg9tT1UTx3ku54I6bbn8+eYnSfYqU6l/Tv7UpO+2XPz1zx0h/MYAVQGlcm6QHl2/U8pWbjMmGco4A8NInLPYy+XDJ0odeNI+s3CRjlLoTBoShVWFr35Sjjhx+U/sv33f5+991lKIoGbhK7QeQNGiTv15/27OKt/XNyGTYC2DPJ0xSmLEqbumd8as/PLXLSQTSUfz7R/ofkoz0fzUj/QH8o8AaOed13U2rpEywzKdwVHvqRin5ZDrg3J//7gn1FmIFgWEoACpu55H+H5xw3Jwbf85IfwC7199z/fBjm3Tvg+uNaQiXpHGnW5vGExc2hHps2Yazrr/lWXmffBoAKvaQWCO5ZKT/9Gknz7l2/rs0rJmR/gBeoiGbLPypa369UtHWvhmZlDYSUvn2MkZS7A75r0UrZIz4roqK6R/pb5zXf37vbfMum/0WRvoD2GMj1lqjjZt7tfCXK+9QQzg3rWPZUhkA4tjLNmfnX9++ytz70IsyxjAYEEMuDK2KncXxo1rz836z4D3+wk++mpH+APbS+vcyRrpq4TKtfWrzkkw+VFrLV2r7L4PAqtBRmDb3h/fLsCowhvr+C60Km3unjR076rqbf/W+Ke95+xGKY0b6A9hb69/quTWdunz+A5fbxuzcNG9sl9oAEMdOwbDsFb/+3RPmlrtWK7BGsWNxYAwuY5Ju/+LGnovf9e5XXn7z4vfppONGbi/+APDSrf/kHfLNy+/Vxuc7Nge5INW916kewWSMUVx047/47btUKMQyMkwLxOA9DDbpaipu7ZtywQWvm3Xdz96j0aMaKP4A9t5odcl74pa7V+tn/73MhMNzs12c7kZrqgOAc16Z5syS+/6yZvrcH96fbKvIWAAMxoMQGEXFWD5y+o+5p8/7wXfeun0eL8UfwJ5b/l5GUmdXURd+9c8qRm6cbPqnsKd+DpNzXkFz9orvfP9v5q8PvKggMIoJASijILCKeiK15MJJi64+0190zv/aPtiPkf4A9qX1b63R7Mvu1fL7XpyVacq0V8P09dQHAO8lExr1dUcTzv/Kberti7cnLmDAxT+0KnYWxh90YONNv/+fsxd88EyW9QWwH8U/dgoDqxv//Jwuu/I+E7ZmZ1dLT3VVrGLiYq/MsMzipXevnvmN7/8tGRDI4kAYoDC0Km7pnXLMsSOua7/2/ePe8oaDWdYXwL7XptJiYM+v7dKnP/+nZbGXZKtnrFrVLGPmYq+wNTf30svuPeM3Nz6tMLSKImYF4OUX/8LGnotPOXXMvPZF79XYo9sUx55lfQHsk2S+v1FPX6yPXnijVq/aMjdsCKtqnJqtnpMtyRjZ0LR/5nN/mv/goxuTEEBPAPbDjjX9e2a874PHzrr+mrN12MHN20fwAsC+1KP+FUE/9bmbdfufnp2ZGZZfGMfV1SitqoXMnfOyuUAbNnQvPvsTSzY/+cw2hYEhBGDfbnZr5J1TsaMw6XPT3zDnV1efqeEtpTX9GewHYJ+LfzLob+rM2/SLa5bPyrbl51Zb8a+6ACCVxgM0ZdqfXbVt8pkfu04rntxCCMBeBYFR1BcplHTV99++4Puz3izJy7GmP4D9KP79a/1/bvaduvrHD87MjMjPjuLq/BxdlVuZxXGyPsDjKzed9Y4P/XbN0kc2JCEgIgRgN8U/tCp2FCYcfEDT7b+/5mx/3uQTS4NIjSxD/QHsS+PTS84nnwq/Mvcvuuzye6dnhufmVvOA9KrdyzSOvTIt2SXPPb9tzDsn/uby39/8jMIwWbiFxYKwS/Hf1DPjdScftOiWX7//tHGnHcqa/gD2r964ZKGfwBp97ZJ79H8uuWdqpjV3havy6ehVvZl5HDllGjPauKXvovd+YomZe+V9stbIWj4J1Lud1/R/z9lHz2n/xXt17FHDkz0mGOwHYB94nzQ2g9Kqfhd+9c/6ztx7pmZacvOd91W/NL2t9gsUx15hLpACq5lfv336B875o55f26UwoDegbou/NTKlNf3PO++1s37z03errTVXGulvOUEA9qm29DckHnx0o8740G915Y/un5oZlp0fy9fEvjRhLVwo55ILlRmeu+LXv1qp+x54cc6lF7+5YcJZr0oupPOyhj3c60EQGEWFWD7ymvOtt8ybcf7rknvEM9IfwL7VExmjIDDq7Yv1/fkPaM5/Lp3csbG3IdOanx/HtbP+TM00h/q7ajLDc1c8s7qjceK//fGsD069XstWblJgTbKzYOxZQrimi79VsTtSYzYYf838d/kZ785OsUuSOoP9AOyt8PeP8LdGWtK+Sqed/Ut99Ru3z+zsiRZmWrM1VfxrpgdgZ3HsFeZDSVryq2sfm3rDLc+uOXfS2Os+95nXaMxBTdv/N8aw0UtNFf/Qqri1b9Khhw+bdc2P3nnUW95YWtaX7/0A9tBwdKWd/Prrwd8efFHfvnypfveHJ4ycxmfaGpY452py+fnAtL6nJi+q91LYEC7t7YtX3v3n5zf/93VPdG7ZVhj7qiNa1TY8t/1zQBQ7ic8DVXVtrTV68plt+u9fPTbbBkZhaFTc1Dvj5DcdcuV1C8a3vXbsKIo/gD3UB5+MCbLJVGBjjB5cvlFfu+QeTf/GnebRh9atDZuzS202WFnL48iMPfyqmr7YSUvfqtgXST3FacMPaWmYOP6Vcz414Ti96eSDdvnfRpGTMUbWShLTxNKofwrfDbc9pzM/fp0Jk5b/tIkTj7t8/qVvU2tLVlFpdy4A6C/4SUvf7DILqFh0uvmO5/Vfix7Vb29cZfo29c4wLdm5YVgfG87VfADYEQSMAisVCk7qKs4IWjJzT3vjIf5D732V3v22I3TEoS3/8P/ZZRaBMRqMPOB3+ve9/I8G7wH5u/8eBia1PSL9AeCm25/XOyb+xsj5cV/74htv+taXTkn+eZ0t65sMafHlvReG4r1nhuj3qbbrWXO/USXOn0/+Q2nfj79/lfUVYt3/yAb94ZZn9Jvrn9bDj6w36ounmebMFWFo5VxtjPDfF2HdPFjeK4qlIDQK2nJzo9jrtlufnXzbLc80NB/QuPmU14xe9M+nHqKTTzxArxl7gEYf0JB0Dw1JMaGrYX8VirGacuH4q7739usmf/CY7TNB6qn49w9YKuf9Y4byduS2xxDcWL19sZ56ZpvueWCd7rl/nW77yxqtfHKzcdsKFysX3Bk0hLIN4RXO+brbZr5uegB2J7BGMkk3kHqiSSq6sWrOzGwZlpt0zFGtC457VZtecWiLRo9q1PBhOTU3hdu/QWczdnua3N2LuVDct9GisfPJ77/bXou9/yzvfdKrsYcWYqEY7zHRForx9gLqYq+PfeAYHX3k8J0KTPqK3nXtq3Tznat12cVvrssu//6ejm2dBW3e0qcgMANu1JlSD0uh6Ibk85fzXsVC+UdVe0mFQlz2VlyhGGswPweb7e+OeJAbQ6XzMxh/BrPnd1pZrkPBaecV+IwxymWtnJN6eiP19EbauLlPL6zv0lPPbtMjKzZp9bouU9jWN0FFd4Iawtk2GygMrJyv77Vi6joA7HzTWmNkrFEcO8WRl4rxOBXcyYrdwQrsWmXsMgVmyfb/U39h3N3N4yV5P24f31Z5ed8waP88Oca2Pf9ztUleMupRwZ38699+4LT3vfOo7d3tqSyAcfLgBoGpu9kcUeQVhkb3PPCiPnruDVq3ofssE9oG79Uz8OLge71X+1D8OXyp4A1WUKyGn7m74jwkU5UH88/ipUHtQ3e7ebda057cUH68Yn+IovgoSVIYPKWsna+MVRhYWZssEOed5wuU6ugTwN4eujiZD5L0DIRGJpNpt01qlzHypSUfd72n/W67m3YKFWV5ie5Ll+xey99emnNm5/RedMplw9Q/G0Fg6nJJ3/7if9Ptz+tDn/njrM2be+80ubDd98bV2aVuBuvHmkE51sE+xWaIZiSZQX92zGCeo/bdvcNL/2zJzufQey/vJC/PyrAEgP1L4W6XQr+nuLv7n5GiP9E+v3ziyFXNYkle9fMZ2Xspdk5haLX490/qkxfedEZ3X9yeacrKxU4K+aCeokfp5ddMPzTj8wb/EfcVOfYd/4xCTwBATauf4u/lvBQGVj9c+IgunHGb8VYK84G2r0zG+45wAewnJksDKZYMzkymM836/t90/udvmajQKsgEcux4CYAeAKD2JFsXW3X3RDpv5q1asHDZ9HBYbvFgDp4DQAAAUEHJUsZWq57v0McuvEl33fbszExb/orYebqKARAAgNot/kZ/e2i9Pjzlej31+Kap2REN86PIcXIAEACAWhSXiv+vb3han/ps+/StW3uXZ1vz7RR/AAQAoAb1b0saBEb/+V8Pa/pXbjPeGmWaMsmOlQBQZswCAFJQ/L2SpX2/c8VSTfvyLRNtNlCYDepubXIA9AAAdaF/mp81Rl/45p36/uX3Tg1bGOkPgABQ86w1Zd/BznvRbVwlxd9ao9h5Tf3yrfrJ1Q/OzAzPz3d+gNuRGskEaflDSp5bESAA4O9f1EZRT6SoqzCvrD83sGtsa242Jzi9+nfz6+ou6hMX3axfLl4xM9OWnzvgaX5W8pHkNmuOvPIy6q1g8W9TVktti+YzdREgAKD/PW2M4t6iXvua0f697zxS3mvAW7D2/4w167r0k58/OtuV4WdiEIp/aYGfFzf26EPn3qBbb1o1KzsyPzeKBlYlTSDF3VKmTRPGfMrPsFlVbM0A76SgQep8XFr3ezPfZtO2PwYAAkClAoA1inqji0957Whd/Lk3lPVnP7Fqq376Pysk72UML950FX+vILBatnKTPnrejXro/nXTMyMbrhjoND8TSHGXxuVG680nflezDjg96QmoyIYJLumJCBukZV+XfKTxymkJvQAAAQDb39qmt7snUjFy278HD+i9W/oZGzb1cG5Txvvk+gSB0R9vfVafvPCmxS++2L0g05ZfEpej+G/TpMZXacZJl2nssOOl3rWmIr0/3kk2IxkrPfIlafX/aLJt1hLGAQAEAOymJyAT2rIGgDBgdme6in/S9A0Coyt/9ogu+uptJnJSpjmjshT/LZrW+gZdftJ3pfwYqbhVshV4sn0sBY2S65WWzZTW/UFT7TAtFMUfIAAA9WbnYPelb92l715+72TbGCrM2IHN8TfJ+I54i6YdeKYuP+FbRmGLFHWWZgAMZXe7ST43BE1SYb308Je9Nt+p6UGb5vuIewAgAAB1Wvy7uov65EU369pFK2Zl2vILnR/YHH9jk672uEsTDv+0Lj/6i0byyQDAIS/+Sop/2CJ1PSk99Hmvzkc1ORiuhRR/gAAA1J1ksJ/Rxi29mjjlev3pxlWzsiPzs8sx0t/1JUX+2K+YRYd/wijukrzzSTAYouJvSjnDR1J2uNGme70e+ZK/vHeN2oNhWuJj7gGAAADUmf7d/J5d06kPnvNH3fuXNdOz5Rrp3y1lWjXu+FnmptFnGhW3lqZ6WjOkDX/vk1+ZNmndTdKyr3gTdUpBczIWAAABAKjL4r9s5WZ98N/+oMeWb5yabcvPL0vx79CExlfq4hPnmLGt/8uouHmnFf+GtPonXQCZFun5n3s99r+98U4K8hR/gAAA1GPxj7zC0OjOv72gCef88Y61azvnZobnlgy4+IdSvEVTWl9v5p10qVXuICXFPxzi4m+SAm8zye/9+PecVv3Yn2Xzks2y5C9AAADqTNIdnhT/RUue0DkX3Ty5o6u4MNOcLdc0vymj3mbmjf3ftnIj/VUa6d+Y/P4rZnut+4Ofalu0RKL4AwQAoM70j/Q3xmjuVfdp5jfvMgqNwoZQ8UA2ZOqf5rdVUw56r5l3/MVWJjCKe7yMNUNf/GOvsMWo+xmvZV912rrUTw1aNd87iRX+AAIAUFf6R/r39sW64Cu36af/9+GpQXNWxhq5Ac7xl6S4Q5MO/bidd+yXrXycjP43QQWKv5Myw4w2L/Va9hW3oOc5vyRo1WK+9wMEAKBui//aF7v1sQtv1C03rpqVGZGf75wf+Bz/WHK9Gn/kBXbBK88LFPck2wMbqwq0/KXMcKMX/uD06KzYRD1S0MJgP4AAANSh/pH+D63YqA9PuUGPPrJ+emZkwxXl+N7vepMBdsd9PbjusIlWUZckb5LiP6SVvzTNb5i0+lqnFd+OjRcj/QECAFCvxb800v/2v63Vv376D4tfXNe9INuWX1Ku3fyyo3TUCbODeQe81aq4rTTH32jop/lJCpukVT91evyy2NisZAMG+wEEAKBeW/6h0W9vWqXJ5984dVtnYX6mOauoTLv5tYw1C8Z+K1TLMUbFLZWd4x80SE/+INLT89xE25j8PYo/QAAA6kr/Vr5hYPSTXzyqc79wi4m8L99I/22adMC/2AXHfz1QdrhJWv5DXfyNJCcpSOb0P/bdWM8tcJODZi32Qx1CABAAgErrn+YXBEZzfnCf/v2bd55l84HCICjfSP8PBwuO+VIoeSnq8jLB0K3p338oPpZMJjmoR79V1Jpr3dRgmBZ6T/EHCABAnekf6R/FTtO/cYeu+uH908NhuSXeDGw3v/5v+q5H418xJVjwyvNDxb2lImzNkBZ/SXKxZPPJAMTlsyOtv9FNDYaV5vgDIAAA9Vj8X9zYo09Ma9f1f3hyZqYtf4VzfkDfwo1NVtTzsXTMl8PrDvtIoLhrxz8baj5OBvv1rpOWfb2oLX91yQI/jPQHCABAvRb/Bx/dqI+df6OWPfDizMyIhrkDnuZnJVdM/nr8NzL+kPcGyW5+/YW/EnP8h0nbVjgt+3q0pmulmxm0aiHFHyAAAHXFS3Kl4v/HW57V5AtunL9hQ8912RHlmebnepPR9SfMyvgD/yVIRvoPdfEvfX7wTsq0ShvucFo+qzC5sFFrg2Fqp/gDBACgvoq/l5xPiv9VCx/R9H+/zUReyjRnyjPNr1Pjc6PN2LGzM3NGvDFQcYuvwDQ/I5XGLmRajFZfG+mx7xaNj6SgiQV+AAIAUGec9zIyCqzRty6/V9/49l0TbUOoMLCK44FV52SOv5/UMjZYcMKsjJpfaZNu/wqt6W9CoyAjPfnDSE9fXTzD5iSbo/gDBACg3op/aZqfJE3/xu264gf3TQ+H5RZ7DXykf7Kbn58y6vRg3vFfyykzXIo6KjPH38elQl+Uls8paO1v46m2Re39wQAAAQCoG3HsFARWPb2RPvX5P+kX1yyflWnLX+G8H9BUvP4NfeIeTTj0o5l5R382Kxkp7ioV/6Fu+UdS0CgVNnkt/2afNt3p2MoXAAEA9Vr8vYLAas26ZDe/W9tXzcyOzM+NogF2+feP9DfSsV/OLTp0QiDXk8y1r9hufi1G21bGWja7sLlrZTw1aDVs5QuAAIB6Lf5G9z60XpMuvFErHtkwPTOi4YqyDPbrkTLN0vFfy/sD3xaquM3LGFVmNz8nZVqNNt4dadk3+6YWNvinghbDSH8ABADUl51H+i/+/ZP6zOdunr51a9/ybFu+vTwj/f34/Bh71omz81OGn1Spkf47fq9Mi7Tmt0U99r0+4wqM9AdAAEBdFn8vY4wCY3TJD+/XjG/eaRQYZZrKNM1vm5/UcmKwYOzFeTUdYVXY6mVDIy8/ZMXfGCPvvGSNwpz01NUFPXV1n7EZw0h/AAQA1J/+kf5R7PTZr96uH/34galhc1aypjzT/Lb6KSNPC+cd//W8MsOMih3JNL9kIKEZuj9nLNlMMv1gxfd6tXpxcbJtMmzlC4AAgPot/l3dRU2a1q5fL14xNzOyYX6ypv8Ap/kpafkfdFZm3rFfyMuEyRiAigz2c8k0P9crPTqnR+vbi5ODFsNufgAIAKg/O2/o86Fzb0hG+o9qnBuVYU1/H0txrx9/xCdzC476TF6u6OUKFSj+pTn+QaNU2OC17Fs92vK3aHIwzLCmPwACAOpPFHuFgdGq5zv0vk/9QQ8ufWF6thwj/a2SQm+kY77QcN1hH8wo6k6+8xujiszxD1uMOp+MtWxWz1NdT8Qzg2FM8wNAAEg9572iyO2yIt3L/lmlnzHQ79q1UvwfeHSj/vXTf9CTj2+enG3LLyzbNL8W6fiZjf6Afy5N87Ma4upvJJ9sS5wZZrVpaVHLv9Uzs+9Ft5RpfgAIANXA+3xDLlQYlneS+Ijhufo8nUp28wsDo5vvXK2PTL1+wfr13QszrbnyTPPr8BMajggmjf1aw1mtJ4YqbvXJmv79v/lQDfjzkvdGmRajF24s6rFLu03cKwVNhpH+AAgAqW/5Oy/lwjsfWLZBl//koe3T1AaWJ5Kf8dzqDvnSWra+TjoDfGn53iAw+ukvHtUFM241vYVYmaaM4jJ0+8fb/KThJ4cLTvhKo/Kjban4q0Ib+khhTnrmv/v05PweYwKm+QEgAFRPAPBetiFsv2fpWnPPHc/NKOsPD+wa25SRMXVyLkufPoyRvnbJPfrOpfdMNPlQYS4c2OeQ/g19OvykA8dlFxz3pUYFeSnqqsBufv2D/XLJUsMrLu3Rmt8WJtpGpvkBIABUYbNVCrKhgnw4t8w/tm7GAfRv6NPRVdRnvvgn/eJ/Hp2Zac0vdhr4bn6SFHf6CWP+NbfgmAsa5b1X3FuhaX6RFDYZ9a5zenRutzb/tTg1GGYWM80PAAGgWjOA94roun2ZxT/Z0OeZ1R366Pk36a7bnp2VHZmfG8UDXH3PSHKSK3gdeU7DoiMnNSju8/LOVGakfyxlhhltXR5p+f/uau9eFc9nQx8ABADUpSjyCkOjvz74oj485Xo9/cSWqdmRDfPLMs0vkoyTjr2o0R/6vryirqTiV+KTSn/xX39HQY9e0n1GcatrD1oY7AeAAIB6LP5xUvyvv/VZfWTqDTO3bOldmh1enpH+rk+yGem4Gc1+9BkZFbd5yUpGZvvAysFmVNpDwBmFLUZr/tCnx/6jyyQL/lD8ARAAUGe8l5xzCgOrhb9aqc9cdLPpi135NvTp9sq22QnHz2xeNPKUTDLSv7Q2w5Ct698/oM8YBc1Gz/6iV0/+qNuYULJZRvoDKB/LKUB1FH8v75Nv/t+b/4Amn3fjGQXvFeaC8mzo0+EnNL0ieOSkOS2LRr6hv/j3/+ZD+OeMk6cyyBk9dXW3nriq6wyTlRQw0h8APQCoMztP8/vyd+7Spf9x7+SwKdPurZErxzS/bX5S2ynZBcd/qUnZkUGyut9QT/NTaUOfbPLXFd/v0trreicHzabdD3EIAUAAACquf0Ofnt5In/nSLfp//71sZjg8v9D7ge/mJy/FXX7CIWflFrzq/OZkN7+uCizwU5rjHzYaFTY7rfhepzbeVUh286PVD4AAgHot/i+s79ZHzr8x2c2vrTTNbyD11ibz6n3sddQ5TYuO+EiD4j7J9ZW++fshXNNfXj6SMi1WHY8X9eilnWs6H48uYkMfAAQA1KX+DX0eeWyTPjz1Bi176MXpmXLt5tcnBQ1Gx17U4ke/Ladip5eRtg/4G9I1/V2ypv/6O/q04j86meYHgAAAiv+f7lqtj0694bp1L3QtzLTlF8dl2c3PK9tmJ50wo2XBiJOzO+3mp6Ht9vfJ75lpsnruV916Yn6XkWeaHwACAOqQ98keCWFg9LNrV+jcL9xieouxMi1l2NAnkOIuP67h0GDK2K+0Tmg5ene7+Q3dn9NYyWaMnvhxp55d1H2GzRmZgGl+AAgAqLvinzSJA2t0yQ/v14yL7zjL5AKF+bBs0/xajsssGvuVYWo4KFDUURrsN5TFvzTYz2aS/7riPzr0wh+7Jwcttt17pvkBIACgzvRP85Okiy6+Q5f/4L6pYUt2iTca2DS//uK/zU8a/vrsgrFfblWm1SrqcpWZ5hd52ZyR6/V69PvbtOH2vslBi2WkPwACAOpP7LwCm0zz+9TnbtYvfv7orExbfr7zfmAt4p3m+B/wz/kFx100TDaXjAFIRvoPcfGPpaDRqrDRafklW7XlgcLkYJhZSJc/AAIA6q/4l7byXbehRx857wbdctOqWdmR+dlRVIZpfrEU9/rxh01sWnDUJ5vlS7v7GVtaZ38I9I8r9LGUabbqejrSsku2LOt6MprNND8ABADUpWSkv9WKJ7do4tTr9fB966ZnRpZhml9pQx9jpKPPH3bdoWc3KepxycA7Y4ZuTX8lg/28l8IWo41/7dOKy7dNLWyM5wfNjPQHQABAPRb/0la+d9z7gj485fplq5/bNrts0/y6vbJtwYRjpw1bNOpNORU7nUzpc8BQDvaTk2SlTKPV87/r0pNXdxgfe6b5ASAAoP4kG/pIYWj0i+ue0DkX3Tyxs7u4ONOSK880v04/vvlV4bzjP992SPNR4Y41/aUh39DHhsmniCd+0qHnru08w+SMbJbiD4AAgDqz84Y+/+cHS/WV79xtTGAUNoSK4zIU/w4/Yfhrc4tO+GKrMsP7N/RRZTb0yRnFPU4rr9ym9bf2TA5aDNP8ABAAUH/61/Tv6inqgn//s3624JHpQUtWGuhufkpa2XGHn3DAWxsWHTutVTZjFHf37+Y3hNXfGPnYK2iwKmyKtfzSzdr6EBv6ACAA4CULR1LEytZSLX3rTkvR6S/+z63t1EfOu1F33vrsrMyI/BXOlWE3P0lxp5tw8HuaFx09ZZjkJFfQTtP8zJD9OX0khU1WPatjLbtk01OdTxanB8PMErr8ARAAsNsi5ouS69Oksv7cQGttXu2V/uP1r+l/37IN+siU67Vyxcap2ZEN8wc60r8/5LgeP/7wD7UsOurjwxQXknUDjB36P6ePpbDZqOOJopZdsml+79p4KiP9ARAAsMfinx+j24cdr9N8XIYGq5cUSNFWacv9Q9j83V3xL430v/nO1Zp4zh/nbtrU054dnm8vx25+PkpWCHzlv7Ved9j7mxV3J8sIm6He0Ke/+LcYbXmoT8u/t3lyYXO8MGig+AMgAGAPhcz1asqIN+i0E+dIUdfAW6/eSUGjtOU+6d5PKpmKNtQxwEuxcwpDq8W/f1KfvPCmM7r74vZMU1blmOMf93qFeatjP9vmR5/eoKjT7zhvFRjwl2kxWv+XXq24bLOJe52CvGGwHwACAPbOxVLcYxX3licAyEquzw99NdSO3fyCwOqHCx/RhTNuNd4ahfmgPCP9O/34/MHhacdPb5sx/MScih2udM7MEM/x98lWvs1Wa2/q0sp5W4yPlUzzo/gDIABg36qmlZxNWusDThOS4qQSG8VDGgH6p/kFxuhbl92rb3znrolBQ0Y2KNdIfzeh9dW5RcddOEINB1d2jr8JjIKc0apfdOjpa7YamzGyIdP8ABAAsF8VRZIz5QsA/b+GUP9I/yj2mva1P+uH8x6YnhmWW+xKwWBArW1JcZcbP/pfmhcdfc5w2VxpNz9rSlsID13D37ukle8irxX/uVkvtHeeZRts0gHhuZUBEACwXwHAyMelQWMDLCLeJS1U74auUdxf/Ne+2K1PXHSzbvrjkzMzbaVpfgM5iNJyuq7Pjzt8Qut1R360VXHBK+7r39Bnp4QwJD0cUtBgVNgYa8V/btKW+3smBy12ia/M1xYAIABUffPfm+QzQDkKSf/PGKLmaH/xv2/Zen38vBv16CMbpmdGNFwRl2Gkvyt6GRkdPXXETYe8q1lxT5JqKjLS35Wm+T1W0IofbLqu+9ni/GCYZY4/AAIABli0Y1v6dj/QZqqSn+MG9xuA90nXfhAY/fbGp/Wpae2zNm/qXZptyy8py25+vV5B3uiY80f5A9/cWNrQx+zYX3co7LSgUqbFaP1fe7TyBxtNsdOJOf4ACAAYaJHpkZd8bMv7CWAQi1OyxW1S/C//6UP6/NduN85ImeZMeab5dXvlRgZTjvvsyHnDT2pQcZtL1vTXELf8S59RMk1Wa9s79Pj8zcZ7JdP8KP4ACAAoS1PT21JlLUNvwiAugetc8v3dGqOvzb1H37nknqm2KaMwMIrLNNK/+ejcZcd/dtQhjYdmFG1zpTX9h7L6l0b0GaOwwejZ32zVU/+9JRnpHzDSHwABAGVsaSo2ZfwEYKS4/MWyf5pf7LzOm3mbfvzjB2dmhufmOz/wkf7GJGv6j/qnxkVHTxmpTHOgqMvvVPwHL9T8Q+13kgmsbCg9+bPNev53W8+weUb6AyAAoMy8bOkTgC/TJwBT9jEA/YP9OrqKmjytXb/55WOzMiPyc2M3sGM2pYIb97lxh57duujIj7VJLlntr6wbJO3r+YuSLv64z2vFjzbqxds6JwZNtn1IOyAAgABQ85V/x19jm6wuV47eBJe0mss1Xq6/+K9+oUsfPu8G3XHrczOzI/Nzo2jgXf6umHxSOPqcUTcd8o5hintdqffdVGZN/yajnnWRHrtqvbYu650YNNvFdPkDIABg8IKAK30CKEcAiE0SKMpS/J2y2UAPLN+oD0+5Xo89umFqZkR+fjk29In7vMJGq2PPH+UPeGNTsqxv6XPAUJ9/76VMi9WW5b1acdX6ub0vFNuDFtvOYD8ABAAMolLB9n7gIWD7qoIDCwDJIj5e2Wyg3930tD497ebLN27qWVKu3fziHq/cqGDacRceePnwE/LJSP/ta/oP8WA/SZmmQOv+3KHHf7rRRD1OQaNlpD8AAgAGtQb1ykne2WRZ24GOAfDJGADvzcv/UV5qaAhljNHcK+/Tv3/nbpNMhyvTNL9ON77pFbkZx3/2wNOaDssq6nB/t6b/0Az2k5NkjYKc1TO/2qKnF20yNpCCHBv6ACAAYNCVVgLs/wRgBv7jkh6Al/eDvJeCwOiJp7fq5799XD+Z/+CsoDUnY8s3za/11Q2Ljj//QGXbAkWdpTn+Ffjeb8NkYaGVP92gtTds3bGmP8UfAAEAQ5UBtm8GVLYAMIBPAIHVBV/7s4m7ihPCtvxi732ZpvnFE0ad2rLomM8cKJs1inpKa/pXYFlfmzWK+5xW/ni9NtzdOTFoZk1/AAQADDmzYxrgAAPA9k8AzgzgZySb+ITN2cVugDMTTOkze9ztxh9y5vBFR31sVP8GP0Pf8jdJyz/IGxW2xnrsqnXa8nAPI/0BEABQIU6lvQB8eXoA4oFvLWzMABf30c7T/KSjJh9w3aFnDlfc55KFdqypyBz/sMmqe3VBj165bmnX072zghY29AFAAECl7LwdcLl6AMo0DXAgre24xykzLNTR/3aAH/X6ZkWdcfLnM0Pf7S8vhc1WW5Z167EfvTi1b2M0P2hipD8AAgAqyRrZTKjA+YHPgffJ922bKVau9hvJFbxaXtmw6fgLDmprOiyrqMspbAiGZID/7kKRzRi9eHeHHr96nYn7vIIGRvoDAAGgUg1/LykwiwubY216oCfpLi9HAc4YdT9fqGjr30d+fPMrcm2Fjlidd3XIBqZCJzkp/p3P9mnVLzcaH3vZLMUfACTJ2MOv4ixUPA0MTiGueMBxXrKVPRCjZCyCzRipAvsLAAA9AEhtsR6UP5KRFKTjD2ZzZvCCFgAQAICUovADwD82jjgFAAAQAAAAAAEAAAAQAAAAAAEAAAAQAAAAAAEAAAAQAAAAAAEAAAAQAAAAAAEAAAAQAAAAAAEAAAAQAAAAAAEAAAAQAAAAAAEAAAAQAAAAIAAAAAACAAAAIAAAAAACAAAAIAAAAAACAAAAIAAAAAACAAAAIAAAAAACAAAAIAAAAAACAAAAIAAAAAACAAAAIAAAAAACAAAAIAAAAEAAAAAABAAAAEAAAAAABAAAAEAAAAAABAAAAEAAAAAABAAAAEAAAAAABAAAAEAAAAAABAAAAFAO/x94xk2GdPeCsQAAAABJRU5ErkJggg==";

  var _accent = C.primary;
  function setAccent(c) { if (c) _accent = c; }

  function Eyebrow(children, color) {
    color = color || _accent;
    return '<div style="' + css({ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: C.mono, fontSize: 10.5, color: color, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }) + '">'
      + '<span style="' + css({ width: 14, height: 1, background: color }) + '"></span>' + children + '</div>';
  }
  function SectionDivider(index, title, subtitle, accent) {
    accent = accent || _accent;
    return '<div style="' + css({ position: "sticky", top: 0, zIndex: 30, background: C.base, borderTop: "1px solid " + accent, borderBottom: "1px solid " + C.borderStrong, padding: "14px 16px" }) + '">'
      + '<div style="' + css({ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 14 }) + '">'
      + '<span style="' + css({ fontFamily: C.mono, fontSize: 11, color: accent, fontWeight: 700, letterSpacing: "0.16em" }) + '">SECTION · ' + index + '</span>'
      /* Başlık <h2> — hiyerarşi h1(hero) → h2(bölüm) → h3(alt bölüm) tamamlanır;
         eskiden span'di ve ekran okuyucu h1→h3 atlıyordu. Görsel aynı kalsın diye
         h2'nin varsayılan margin/font'u sıfırlanıp satır içi tutuluyor. */
      + '<h2 style="' + css({ fontFamily: "'Sora',sans-serif", fontSize: 18, color: C.textPri, fontWeight: 600, letterSpacing: "-0.01em", margin: 0, display: "inline" }) + '">' + title + '</h2>'
      + '<span style="' + css({ height: 1, flex: 1, background: C.borderStrong }) + '"></span>'
      + '<span style="' + css({ fontFamily: C.mono, fontSize: 10, color: C.textFaint, letterSpacing: "0.1em" }) + '">' + subtitle + '</span>'
      + '</div></div>';
  }
  function SubSection(num, title, eyebrow, children) {
    return '<section style="' + css({ borderBottom: "1px solid " + C.border, padding: "32px 16px" }) + '">'
      + '<div style="' + css({ maxWidth: 1280, margin: "0 auto" }) + '">'
      + '<div style="' + css({ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }) + '">'
      + '<span style="' + css({ fontFamily: C.mono, fontSize: 11, color: _accent, fontWeight: 700, letterSpacing: "0.1em" }) + '">' + num + '</span>'
      + '<h3 style="' + css({ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.15rem,2.2vw,1.5rem)", color: C.textPri, fontWeight: 600, letterSpacing: "-0.015em", margin: 0 }) + '">' + title + '</h3>'
      + '</div>'
      + (eyebrow ? '<div style="' + css({ fontFamily: C.mono, fontSize: 10, color: C.textFaint, letterSpacing: "0.12em", marginBottom: 18 }) + '">' + eyebrow + '</div>' : '')
      + children + '</div></section>';
  }
  function EmlakEkspertiziLogo(size) {
    size = size || 56;
    return '<img src="' + EMLAK_LOGO_URI + '" alt="emlakekspertizi.com" width="' + size + '" height="' + size + '" style="display:block;border-radius:2px">';
  }

  function injectBase() {
    if (document.getElementById("nx-base")) return;
    var s = document.createElement("style");
    s.id = "nx-base";
    s.textContent = [
      "*{box-sizing:border-box}", "html,body{margin:0;padding:0}",
      "body{background:" + C.base + ";color:" + C.textPri + ";min-height:100vh;font-family:'Inter Tight','Inter',system-ui,sans-serif;font-feature-settings:\"ss01\",\"cv11\";-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility}",
      "h1,h2,h3,h4{text-wrap:balance}", "p{text-wrap:pretty}",
      "a{color:inherit}", "button{font-family:inherit}", "::selection{background:rgba(56,189,248,0.30)}",
      /* Mikro-etkileşim — yumuşak geçişler, kart hover kalkışı, erişilebilir odak halkaları */
      "a,button{transition:color .16s ease,background-color .16s ease,border-color .16s ease,transform .16s ease,box-shadow .16s ease}",
      "a:focus-visible,button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:2px solid " + C.primary + ";outline-offset:2px;border-radius:2px}",
      ".nadas-eco{transition:border-color .18s ease,transform .18s ease,box-shadow .18s ease}",
      ".nadas-eco:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(0,0,0,0.30)}",
      "@media (prefers-reduced-motion:reduce){a,button,.nadas-eco{transition:none}.nadas-eco:hover{transform:none}}",
      "@keyframes tickerScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}",
      "@keyframes nadasPulse{0%,100%{opacity:.4}50%{opacity:1}}",
      "@keyframes nadasGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}",
      "@keyframes proxCursor{0%,49%{opacity:1}50%,100%{opacity:0}}",
      "@keyframes glowPulse{0%,100%{box-shadow:0 0 20px rgba(34,211,238,.3)}50%{box-shadow:0 0 40px rgba(34,211,238,.6)}}",
      ".nadas-twocol{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}",
      ".nadas-twocol-arrow{grid-template-columns:minmax(0,1fr) auto minmax(0,1fr)}",
      "@media (max-width:900px){",
      ".nadas-twocol{grid-template-columns:1fr !important}",
      ".nadas-twocol-arrow{grid-template-columns:1fr !important}",
      ".nadas-arrow{transform:rotate(90deg);padding:12px 0 !important}",
      ".nadas-milestone-row{grid-template-columns:1fr !important}",
      ".nadas-milestone-left{border-right:none !important;border-bottom:1px solid rgba(255,255,255,0.08) !important;padding-right:0 !important;padding-bottom:14px !important;margin-bottom:14px !important}",
      ".nadas-prox-table-header{display:none !important}",
      ".nadas-prox-table-row{grid-template-columns:1fr !important;gap:8px !important}",
      ".nadas-tech-row{grid-template-columns:1fr !important;gap:4px !important}",
      ".nadas-eko-grid{grid-template-columns:1fr !important}",
      ".nadas-feed-row{grid-template-columns:1fr !important;gap:4px !important;padding:14px 16px !important}",
      "}",
      "@media (max-width:680px){.nadas-pipeline-stages{grid-template-columns:1fr 1fr !important}}",
      ".nadas-footer-grid{display:grid;grid-template-columns:1.7fr 1fr 1fr 1fr;gap:36px 30px}",
      "@media (max-width:820px){.nadas-footer-grid{grid-template-columns:1fr 1fr}}",
      "@media (max-width:480px){.nadas-footer-grid{grid-template-columns:1fr}}",
      ".nadas-social{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}",
      ".nadas-social a{width:34px;height:34px;display:inline-flex;align-items:center;justify-content:center;border:1px solid " + C.borderStrong + ";border-radius:6px;color:" + C.textMut + ";transition:color .15s,border-color .15s}",
      ".nadas-social a:hover{color:" + C.accent + ";border-color:" + C.accent + "}",
      ".nadas-social svg{width:16px;height:16px;fill:currentColor;display:block}",
      /* Footer WhatsApp pill — yasal satırın en sağında belirgin yeşil buton. */
      ".nx-wafoot{display:inline-flex;align-items:center;gap:7px;margin-left:auto;flex-shrink:0;background:#25D366;color:#fff;text-decoration:none;font-weight:700;font-size:12px;letter-spacing:.09em;padding:7px 15px;border-radius:9999px;line-height:1;box-shadow:0 2px 10px rgba(37,211,102,.28);transition:background .16s ease,transform .16s ease,box-shadow .16s ease}",
      ".nx-wafoot:hover{background:#1ebe57;transform:translateY(-1px);box-shadow:0 4px 16px rgba(37,211,102,.42)}",
      ".nx-wafoot:focus-visible{outline:2px solid #25D366;outline-offset:2px}",
      ".nx-wafoot svg{width:15px;height:15px;fill:currentColor;display:block}",
      /* Mobil hamburger nav — masaüstünde gizli; ≤820px'te aç/kapa menü. */
      ".nadas-navtoggle{display:none;background:transparent;border:1px solid " + C.borderStrong + ";border-radius:3px;color:" + C.textMut + ";padding:6px;cursor:pointer;line-height:0}",
      ".nadas-navtoggle:hover{color:" + C.primary + ";border-color:" + C.primary + "}",
      ".nadas-navtoggle:focus-visible{outline:2px solid " + C.primary + ";outline-offset:2px}",
      ".nadas-navtoggle svg{width:20px;height:20px;display:block}",
      "@media (max-width:820px){.nadas-navtoggle{display:inline-flex;align-items:center;justify-content:center}.nadas-navmenu{display:none!important;width:100%;flex-direction:column;align-items:flex-start;gap:14px;padding-top:8px}.nadas-navbar.is-open .nadas-navmenu{display:flex!important}}",
      /* Lenis pürüzsüz scroll (vendored) — önerilen taban stiller */
      "html.lenis,html.lenis body{height:auto}",
      ".lenis.lenis-smooth{scroll-behavior:auto!important}",
      ".lenis.lenis-smooth [data-lenis-prevent]{overscroll-behavior:contain}",
      ".lenis.lenis-stopped{overflow:hidden}",
      /* ProX kurumsal wordmark — insaat/ sitesindeki .fprox lockup’ının birebir karşılığı.
         Oradaki sabit px’ler em’e çevrildi (referans 14px gövde): 2px→.14em, 6px yarıçap→.43em,
         X’in 14/15 boy oranı→.93em. Böylece 10px mono etikette de 40px başlıkta da aynı oranda durur.
         Renkler aynen: kutu #16a34a, hover #1fb155, kutu içi #0b1220. */
      ".nx-prox{display:inline-flex;align-items:center;white-space:nowrap;font-weight:800;color:#fff}",
      ".nx-prox-x{display:inline-flex;align-items:center;justify-content:center;min-width:1.4em;height:1.4em;background:#16a34a;color:#0b1220;border-radius:.43em;font-weight:800;font-size:.93em;line-height:1;margin-left:.14em}",
      "a:hover .nx-prox-x{background:#1fb155}",
      /* Atlama bağlantısı: uzun sayfalarda klavye kullanıcısı nav'ı geçip
         içeriğe atlar. Normalde ekran dışında, odaklanınca görünür. */
      ".nx-skip{position:absolute;left:8px;top:-48px;z-index:200;background:" + C.violet + ";color:#04231F;" +
        "font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;padding:9px 14px;border-radius:3px;" +
        "text-decoration:none;transition:top .15s ease}",
      ".nx-skip:focus{top:8px;outline:2px solid #fff;outline-offset:2px}"
    ].join("\n");
    document.head.appendChild(s);
  }

  function startClock() {
    var el = document.getElementById("mast-time");
    if (!el) return;
    function t() { var d = new Date(); el.textContent = d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }); }
    t(); setInterval(t, 1000);
  }
  function seoAdapt() {
    try {
      var o = location.origin + location.pathname;
      var can = document.querySelector('link[rel="canonical"]'); if (can) can.setAttribute("href", o);
      var ogu = document.querySelector('meta[property="og:url"]'); if (ogu) ogu.setAttribute("content", o);
      ['meta[property="og:image"]', 'meta[name="twitter:image"]'].forEach(function (sel) {
        var m = document.querySelector(sel);
        if (m) { try { m.setAttribute("content", new URL(m.getAttribute("content"), location.href).href); } catch (e) {} }
      });
    } catch (e) {}
  }
  /* ProX wordmark markup’ı (string). Şablon içinde doğrudan gömmek için. */
  function ProX() { return '<span class="nx-prox">Pro<span class="nx-prox-x">X</span></span>'; }

  /* Render sonrası TÜM görünür "ProX" geçişlerini wordmark’a çevirir.
     Yalnızca METİN DÜĞÜMLERİ gezilir; bu sayede <title>, meta, href, mailto konusu ve
     JSON-LD kendiliğinden korunur (hiçbiri metin düğümü olarak ele alınmaz — <script>/<title> zaten atlanıyor).
     innerHTML kullanılmaz, düğümler tek tek kurulur: enjeksiyon riski yok, idempotent (.nx-prox içine girmez). */
  var PROX_SKIP = { SCRIPT: 1, STYLE: 1, TITLE: 1, TEXTAREA: 1, OPTION: 1, SELECT: 1, NOSCRIPT: 1, CANVAS: 1 };
  function proxify(root) {
    root = root || document.getElementById("app");
    if (!root || !document.createTreeWalker) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || n.nodeValue.indexOf("ProX") < 0) return NodeFilter.FILTER_REJECT;
        for (var p = n.parentNode; p && p !== root.parentNode; p = p.parentNode) {
          if (PROX_SKIP[p.nodeName]) return NodeFilter.FILTER_REJECT;
          if (p.className && String(p.className).indexOf("nx-prox") >= 0) return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i], txt = node.nodeValue, frag = document.createDocumentFragment(), last = 0, idx;
      while ((idx = txt.indexOf("ProX", last)) >= 0) {
        if (idx > last) frag.appendChild(document.createTextNode(txt.slice(last, idx)));
        var mark = document.createElement("span"); mark.className = "nx-prox";
        mark.appendChild(document.createTextNode("Pro"));
        var x = document.createElement("span"); x.className = "nx-prox-x";
        x.appendChild(document.createTextNode("X"));
        mark.appendChild(x); frag.appendChild(mark);
        last = idx + 4;
      }
      if (last < txt.length) frag.appendChild(document.createTextNode(txt.slice(last)));
      node.parentNode.replaceChild(frag, node);
    }
  }

  function boot(render) {
    injectBase();
    var app = document.getElementById("app");
    if (app) app.innerHTML = (typeof render === "function" ? render() : render);
    addLandmarks(app);
    proxify(app);
    startClock();
    seoAdapt();
    cookieConsent();
    navToggleInit();
    motionInit();
  }

  /* Atlama bağlantısı + <main> landmark'ı. Tüm sayfalar aynı iskeleti kullanıyor:
     Ticker + Masthead + <nav> ... içerik ... <footer>. nav ile footer arasını
     <main>'e taşıyoruz — öğeler yeniden ebeveynlenir ama KİMLİKLERİ korunur, bu
     yüzden boot sonrası çalışan mount() kodu getElementById ile hâlâ bulur.
     Fail-safe: nav/footer yoksa hiçbir şey yapmaz, sayfa eskisi gibi çalışır. */
  function addLandmarks(app) {
    if (!app || document.getElementById("nx-main")) return;
    try {
      var nav = app.querySelector("nav");
      var footer = app.querySelector("footer");
      if (!nav || !footer) return;

      /* Atlama bağlantısı — body'nin ilk çocuğu olsun ki klavye ilk buraya gelsin */
      if (!document.querySelector(".nx-skip")) {
        var skip = document.createElement("a");
        skip.className = "nx-skip";
        skip.href = "#nx-main";
        skip.textContent = "İçeriğe atla";
        document.body.insertBefore(skip, document.body.firstChild);
      }

      /* nav ile footer arasındaki her düğümü <main>'e taşı */
      var main = document.createElement("main");
      main.id = "nx-main";
      main.tabIndex = -1;   /* atlama bağlantısı odağı buraya taşısın */
      nav.parentNode.insertBefore(main, nav.nextSibling);
      while (main.nextSibling && main.nextSibling !== footer) {
        main.appendChild(main.nextSibling);
      }
    } catch (e) { /* landmark eklenemezse sayfa yine çalışır */ }
  }

  /* ============================================================================
     KANONİK ÜST MENÜ (nav) + ALT MENÜ (footer) — ALTIN KURAL
     cozumler.html referans. Tüm sayfalarda BİREBİR AYNI. Tek kaynak burası.
     ========================================================================== */
  var NAV_ITEMS = ["Veri Altyapısı", "Çözümler", "Demo Web", "ProX Asistan", "Research", "Hakkımızda", "İletişim"];
  function navHref(it) {
    var m = { "Veri Altyapısı": "veri-altyapisi.html", "Çözümler": "cozumler.html", "CRM": "crm.html", "Demo Web": "white-label.html", "ProX Asistan": "prox.html", "ProX": "prox.html", "Research": "research.html", "Hakkımızda": "hakkimizda.html", "İletişim": "iletisim.html" };
    return m[it] || "#";
  }
  /* "ProX" bir wordmark — hiçbir yerde büyük harfe çevrilmez (PROX olmaz). Çevresi normal büyür. */
  function upperTR(s) {
    try { return String(s).split("ProX").map(function (p) { return p.toLocaleUpperCase("tr-TR"); }).join("ProX"); }
    catch (e) { return String(s).toUpperCase(); }
  }

  function Ticker(items) {
    items = items || [];
    var list = items.concat(items).map(function (it) {
      return '<div style="' + css({ display: "inline-flex", alignItems: "center", gap: 6, padding: "0 24px", fontFamily: C.mono, fontSize: 10.5, letterSpacing: "0.06em" }) + '">'
        + '<span style="' + css({ color: C.textFaint }) + '">' + it[0] + '</span>'
        + '<span style="' + css({ color: C.primary, fontWeight: 700 }) + '">' + it[1] + '</span>'
        + '<span style="' + css({ color: C.textFaint, marginLeft: 8 }) + '">·</span></div>';
    }).join("");
    return '<div style="' + css({ background: C.deep, borderBottom: "1px solid " + C.border, overflow: "hidden", padding: "8px 0" }) + '"><div style="' + css({ display: "flex", whiteSpace: "nowrap", animation: "tickerScroll 90s linear infinite" }) + '">' + list + '</div></div>';
  }

  function Masthead(active) {
    var word = active ? upperTR(active) : "ANA SAYFA";
    return '<div style="' + css({ borderBottom: "1px solid " + C.borderStrong, padding: "10px 16px", background: C.base }) + '">'
      + '<div style="' + css({ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }) + '">'
      + '<div style="' + css({ display: "flex", alignItems: "center", gap: 12 }) + '">'
      + '<span style="' + css({ fontFamily: C.mono, fontSize: 10, color: C.primary, fontWeight: 700, letterSpacing: "0.16em" }) + '">NADAS · ' + word + '</span>'
      + '<span style="' + css({ fontFamily: C.mono, fontSize: 10, color: C.textFaint, letterSpacing: "0.06em" }) + '">· TÜRKİYE’NİN İLK EMLAK ENDEKSİ · 2005</span></div>'
      + '<div style="' + css({ display: "flex", alignItems: "center", gap: 14, fontFamily: C.mono, fontSize: 10, color: C.textFaint, letterSpacing: "0.08em" }) + '">'
      + '<span><span style="' + css({ width: 6, height: 6, borderRadius: 9999, background: C.accent, display: "inline-block", marginRight: 6, animation: "nadasPulse 1.4s ease-in-out infinite" }) + '"></span>CANLI</span>'
      + '<span id="mast-time">--:--:--</span><span>TRT</span></div></div></div>';
  }

  function Nav(active) {
    var tag = active ? upperTR(active) : "ANA SAYFA";
    var links = NAV_ITEMS.map(function (it) {
      var on = it === active;
      if (it === "Demo Web") {
        return '<a href="' + navHref(it) + '" style="' + css({ fontFamily: C.mono, fontSize: 10.5, color: C.accent, fontWeight: 700, letterSpacing: "0.08em", textDecoration: "none", padding: "4px 10px", border: "1px solid " + C.accent, borderRadius: 2 }) + '">' + upperTR(it) + ' ↗</a>';
      }
      return '<a href="' + navHref(it) + '" style="' + css({ fontFamily: C.mono, fontSize: 11, color: on ? C.primary : C.textMut, fontWeight: on ? 700 : 500, letterSpacing: "0.08em", textDecoration: "none", padding: "4px 0", borderBottom: on ? "1px solid " + C.primary : "1px solid transparent" }) + '">' + upperTR(it) + '</a>';
    }).join("");
    return '<div class="nadas-navbar" style="' + css({ borderBottom: "1px solid " + C.borderStrong, padding: "14px 16px", background: C.base, position: "sticky", top: 0, zIndex: 40, backdropFilter: "blur(12px)" }) + '">'
      + '<div style="' + css({ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }) + '">'
      + '<a href="index.html" style="' + css({ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }) + '">'
      + '<span style="' + css({ width: 28, height: 28, border: "1.5px solid " + C.primary, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: C.primary, borderRadius: 2 }) + '">N</span>'
      + '<span style="' + css({ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 700, color: C.textPri, letterSpacing: "-0.02em" }) + '">NADAS</span>'
      + '<span style="' + css({ fontFamily: C.mono, fontSize: 9, color: C.textFaint, letterSpacing: "0.18em", marginLeft: 4 }) + '">' + tag + '</span></a>'
      + '<button type="button" class="nadas-navtoggle" aria-label="Menü" aria-expanded="false" aria-controls="nadas-navmenu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></button>'
      + '<nav id="nadas-navmenu" class="nadas-navmenu" style="' + css({ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap", flex: "1 1 auto", justifyContent: "flex-end" }) + '">' + links
      + '<a href="https://www.emlakekspertizi.com" target="_blank" rel="noopener noreferrer" style="' + css({ padding: "6px 14px", border: "1px solid " + C.primary, fontFamily: C.mono, fontSize: 10.5, color: C.primary, fontWeight: 700, letterSpacing: "0.1em", textDecoration: "none", borderRadius: 2 }) + '">EMLAKEKSPERTIZI.COM →</a>'
      + '</nav></div></div>';
  }

  /* GSAP + Lenis (vendored) — pürüzsüz scroll + scroll-reveal.
     Reveal TETİKLEYİCİ: IntersectionObserver (Lenis'ten ve dinamik mount zamanlamasından
     bağımsız, sağlam). Animasyon MOTORU: GSAP. prefers-reduced-motion'da tamamen atlanır;
     içerik yalnızca GSAP yüklüyse gizlenir → ilerici geliştirme. */
  function motionInit() {
    if (document.__nxMotion) return; document.__nxMotion = true;
    var g = window.gsap, L = window.Lenis;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    /* Pürüzsüz scroll — Lenis; varsa GSAP ticker'ıyla sürülür (tek döngü). Dokunmatikte native. */
    if (typeof L === "function") {
      try {
        var lenis = new L({ lerp: 0.1, smoothWheel: true });
        NX.lenis = lenis;
        if (g && g.ticker) {
          g.ticker.add(function (t) { lenis.raf(t * 1000); });
          g.ticker.lagSmoothing(0);
        } else {
          (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
        }
        /* iç çapa bağlantıları → yumuşak kaydır (sticky nav yüksekliği kadar ofset) */
        document.addEventListener("click", function (e) {
          var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
          if (!a) return;
          var href = a.getAttribute("href"); if (!href || href.length < 2) return;
          var tgt = document.querySelector(href);
          if (tgt) { e.preventDefault(); lenis.scrollTo(tgt, { offset: -70 }); }
        });
      } catch (e) {}
    }
    /* Scroll-reveal — IntersectionObserver tetikler, GSAP animasyonlar (bir kez).
       Başlangıçta yalnız opacity:0 (transform yok → gizliyken bile içteki position:sticky güvenli);
       bitişte clearProps ile inline stiller temizlenir. */
    if (g && "IntersectionObserver" in window) {
      try {
        var secs = document.querySelectorAll("#app > section, main > section, #app > footer, footer");
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (!en.isIntersecting) return;
            var el = en.target; io.unobserve(el);
            g.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", clearProps: "opacity,transform" });
          });
        }, { threshold: 0.12 });
        Array.prototype.forEach.call(secs, function (el) { g.set(el, { opacity: 0 }); io.observe(el); });
      } catch (e) {}
    }
    /* Sayı sayaçları — [data-count] görününce 0'dan hedefe sayar (bir kez).
       Metin başlangıçta son değeri içerir → JS/lib yoksa veya reduced-motion'da o kalır. */
    if (g && "IntersectionObserver" in window) {
      try {
        var cio = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (!en.isIntersecting) return;
            var el = en.target; cio.unobserve(el);
            var target = parseFloat(el.getAttribute("data-count")) || 0;
            var suffix = el.getAttribute("data-count-suffix") || "";
            var tr = el.getAttribute("data-count-format") === "tr";
            var o = { v: 0 };
            g.to(o, {
              v: target, duration: 1.4, delay: 0.2, ease: "power1.out",
              onUpdate: function () { el.textContent = (tr ? Math.round(o.v).toLocaleString("tr-TR") : Math.round(o.v)) + suffix; },
              onComplete: function () { el.textContent = (tr ? Math.round(target).toLocaleString("tr-TR") : target) + suffix; }
            });
          });
        }, { threshold: 0.6 });
        Array.prototype.forEach.call(document.querySelectorAll("[data-count]"), function (el) { cio.observe(el); });
      } catch (e) {}
    }
  }

  /* Mobil nav aç/kapa — tek delege dinleyici (tüm sayfalarda çalışır). */
  function navToggleInit() {
    if (document.__nadasNavBound) return;
    document.__nadasNavBound = true;
    document.addEventListener("click", function (e) {
      var el = e.target;
      var btn = el.closest ? el.closest(".nadas-navtoggle") : null;
      if (btn) {
        var bar = btn.closest(".nadas-navbar");
        if (bar) { var open = bar.classList.toggle("is-open"); btn.setAttribute("aria-expanded", open ? "true" : "false"); }
        return;
      }
      var link = el.closest ? el.closest(".nadas-navmenu a") : null;
      if (link) {
        var b = link.closest(".nadas-navbar");
        if (b) { b.classList.remove("is-open"); var t = b.querySelector(".nadas-navtoggle"); if (t) t.setAttribute("aria-expanded", "false"); }
      }
    });
  }

  function Footer() {
    var fLinkS = css({ display: "block", fontFamily: C.mono, fontSize: 11, color: C.textMut, textDecoration: "none", padding: "3px 0", letterSpacing: "0.04em" });
    var col1 = '<a href="index.html" style="' + fLinkS + '">Ana Sayfa</a>' + NAV_ITEMS.map(function (l) { return '<a href="' + navHref(l) + '" style="' + fLinkS + '">' + l + '</a>'; }).join("");
    var col2 = [["EmlakEkspertizi.com", "https://www.emlakekspertizi.com"], ["Emlak Endeksi", "https://www.emlakekspertizi.com/emlak-endeksi"], ["Karar Analizi", "https://www.emlakekspertizi.com/ekspertiz-talep"], ["SPK Lisanslı Rapor", "https://www.emlakekspertizi.com/spk-talep"], ["ProX Akıllı Asistan", "https://www.emlakekspertizi.com/yapay-zeka"], ["Üyelikler", "https://www.emlakekspertizi.com/uyelik"], ["Blog · Bülten", "https://www.emlakekspertizi.com/blog"]]
      .map(function (x) { return '<a href="' + x[1] + '" style="' + css({ display: "block", fontFamily: C.mono, fontSize: 11, color: C.textMut, textDecoration: "none", padding: "3px 0", letterSpacing: "0.04em" }) + '">' + x[0] + '</a>'; }).join("");
    /* Her kalem kendi hedefine gider; white-label artık kendi sayfasında. */
    var col3 = [["White-label Web", "white-label.html"], ["Web Yazılım", "web-yazilim.html"], ["Yapay Zeka", "yapay-zeka.html"], ["Kurumsal API", "kurumsal-api.html"], ["CRM Çözümleri", "crm.html"], ["Veri Lisansı", "veri-lisansi.html"], ["Teklif Al", "iletisim.html#teklif"]]
      .map(function (x) { return '<a href="' + x[1] + '" style="' + css({ display: "block", fontFamily: C.mono, fontSize: 11, color: C.textMut, textDecoration: "none", padding: "3px 0", letterSpacing: "0.04em" }) + '">' + x[0] + '</a>'; }).join("");
    var legal = [["KVKK", "kvkk.html"], ["GİZLİLİK", "gizlilik.html"], ["ÇEREZ POLİTİKASI", "cerez.html"], ["KULLANIM KOŞULLARI", "kullanim-kosullari.html"], ["KÜNYE", "kunye.html"], ["ERİŞİLEBİLİRLİK", "erisilebilirlik.html"], ["ÇEREZ TERCİHLERİ", "cc"]].map(function (x, i) { var href = x[1] === "cc" ? "#" : x[1]; var extra = x[1] === "cc" ? ' onclick="NX.openCookiePrefs();return false"' : ""; return (i ? '<span style="' + css({ padding: "0 6px", color: C.textFaint }) + '">·</span>' : "") + '<a href="' + href + '"' + extra + ' style="' + css({ color: C.textMut, textDecoration: "none", letterSpacing: "0.06em" }) + '">' + x[0] + '</a>'; }).join("");
    var SOC = [
      ["Facebook", "M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z"],
      ["Instagram", "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.24a6.6 6.6 0 1 0 0 13.2 6.6 6.6 0 0 0 0-13.2Zm0 10.89a4.29 4.29 0 1 1 0-8.58 4.29 4.29 0 0 1 0 8.58Zm6.86-11.15a1.54 1.54 0 1 1-3.08 0 1.54 1.54 0 0 1 3.08 0Z"],
      ["X", "M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.22-6.82-5.97 6.82H1.66l7.73-8.83L1.25 2.25h6.82l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64Z"],
      ["LinkedIn", "M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.4 8.4h3.1V21H3.4V8.4Zm5.34 0h2.97v1.72h.04c.41-.78 1.42-1.6 2.93-1.6 3.13 0 3.71 2.06 3.71 4.74V21h-3.1v-5.55c0-1.32-.02-3.02-1.84-3.02-1.84 0-2.12 1.44-2.12 2.92V21h-3.1V8.4Z"],
      ["YouTube", "M23.5 6.5a3.02 3.02 0 0 0-2.12-2.14C19.5 3.85 12 3.85 12 3.85s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.5C0 8.4 0 12 0 12s0 3.6.5 5.5a3.02 3.02 0 0 0 2.12 2.14C4.5 20.15 12 20.15 12 20.15s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.6 24 12 24 12s0-3.6-.5-5.5ZM9.6 15.6V8.4l6.24 3.6-6.24 3.6Z"]
    ].map(function (s) { return '<a href="#" aria-label="' + s[0] + '" title="' + s[0] + ' — yakında"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + s[1] + '"></path></svg></a>'; }).join("")
      + '<a href="#" aria-label="N Sosyal" title="N Sosyal — Türkiye’nin yerli sosyal medya platformu · yakında"><svg viewBox="0 0 575 574" aria-hidden="true"><path d="M171.226 0.078125H0V573.751H171.226V0.078125Z"></path><path d="M76.1875 0.0782019L191.016 300.603L275.573 520.404C289.183 552.162 326.104 573.751 367.482 573.751H501.631C538.082 573.751 574.142 535.579 574.142 494.748V0H402.917V323.053L398.458 311.632L278.858 0H76.1875V0.0782019Z"></path></svg></a>';
    var colHead = function (t) { return '<div style="' + css({ fontFamily: C.mono, fontSize: 10, color: C.primary, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 10 }) + '">' + t + '</div>'; };
    return '<footer style="' + css({ borderTop: "1px solid " + C.borderStrong, padding: "36px 16px 24px", background: C.deep }) + '">'
      + '<div style="' + css({ maxWidth: 1280, margin: "0 auto" }) + '">'
      + '<div class="nadas-footer-grid" style="' + css({ marginBottom: 28 }) + '">'
      + '<div><div style="' + css({ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }) + '"><span style="' + css({ width: 30, height: 30, border: "1.5px solid " + C.primary, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: C.primary, borderRadius: 2 }) + '">N</span><div><div style="' + css({ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 700, color: C.textPri, letterSpacing: "-0.02em" }) + '">NADAS</div><div style="' + css({ fontFamily: C.mono, fontSize: 9, color: C.textFaint, letterSpacing: "0.16em" }) + '">SINCE 2005</div></div></div>'
      + '<p style="' + css({ fontSize: 12.5, color: C.textMut, maxWidth: 430, lineHeight: 1.6, margin: 0 }) + '">Türkiye’de emlak endeksini kategori bazlı zaman serisiyle 2005 yılında biz başlattık. Bugün <strong style="' + css({ color: C.textSec }) + '">480 milyonu aşkın veri noktamızla</strong> sektöre yön vermeye devam ediyoruz.</p>'
      + '<div class="nadas-social">' + SOC + '</div>'
      + '<div style="' + css({ marginTop: 16, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 12px", fontFamily: C.mono, fontSize: 11 }) + '"><a href="mailto:destek@nadas.com.tr" style="' + css({ color: C.primary, textDecoration: "none", letterSpacing: "0.04em" }) + '">destek@nadas.com.tr</a><span style="' + css({ color: C.textFaint }) + '">·</span><a href="iletisim.html" style="' + css({ color: C.textMut, textDecoration: "none", letterSpacing: "0.04em" }) + '">İletişim →</a></div></div>'
      + '<div>' + colHead("NADAS") + col1 + '</div>'
      + '<div>' + colHead("ÜRÜN") + col2 + '</div>'
      + '<div>' + colHead("KURUMSAL") + col3 + '</div>'
      + '</div>'
      + '<div style="' + css({ paddingTop: 16, borderTop: "1px solid " + C.border, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, fontFamily: C.mono, fontSize: 10, color: C.textFaint, letterSpacing: "0.06em" }) + '"><div style="' + css({ display: "flex", flexDirection: "column", gap: 7, alignItems: "flex-start", minWidth: 0 }) + '"><span>© 2005-2026 Nadas Gayrimenkul Bilgi İletişim Sistemleri Tic. Ltd. Şti. · Tüm hakları saklıdır.</span><span style="' + css({ display: "flex", flexWrap: "wrap", alignItems: "center" }) + '">' + legal + '</span></div>' + waLink("nx-wafoot", "WhatsApp") + '</div>'
      + '</div></footer>';
  }

  /* ===== WHATSAPP KAYAN BUTON (sağ alt köşe) ===== */
  var WA_NUM = "905324919453";
  var WA_PATH = "M16.04 3C9.4 3 4 8.4 4 15.04c0 2.12.55 4.19 1.6 6.02L4 29l8.13-1.56a12 12 0 0 0 3.9.65C22.68 28.09 28.08 22.69 28.08 16.05 28.08 8.4 22.68 3 16.04 3zm0 21.9a9.9 9.9 0 0 1-5.06-1.38l-.36-.21-3.76.72.71-3.67-.24-.38a9.86 9.86 0 0 1-1.52-5.29c0-5.48 4.46-9.94 9.95-9.94a9.86 9.86 0 0 1 9.94 9.95c0 5.48-4.46 9.94-9.95 9.94zm5.46-7.44c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.09 3.2 5.07 4.48.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z";
  function waLink(cls, label) { return '<a href="https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent("Merhaba, NADAS hakkında bilgi almak istiyorum.") + '" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp ile yazın" class="' + cls + '"><svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="' + WA_PATH + '"/></svg>' + (label || "") + '</a>'; }

  /* ===== ÇEREZ RIZASI (KVKK Çerez Rehberi · opt-in · varsayılan kapalı) ===== */
  var CC_KEY = "nadas_cc_v1";
  var CC_CATS = [
    { k: "zorunlu", t: "Zorunlu çerezler", d: "Sitenin çalışması için gereklidir; kapatılamaz (oturum, güvenlik, tercih hatırlama).", locked: true },
    { k: "islevsel", t: "İşlevsel çerezler", d: "Harita gibi gömülü içerik ve ek işlevler için (üçüncü taraf gömme)." },
    { k: "analitik", t: "Analitik / performans", d: "Ziyaret istatistikleri ve site performansını ölçmek için." },
    { k: "reklam", t: "Reklam / hedefleme", d: "Kişiselleştirilmiş içerik/reklam için; açık rıza gerektirir." },
  ];
  function ccGet() { try { return JSON.parse(localStorage.getItem(CC_KEY) || "null"); } catch (e) { return null; } }
  function ccSave(o) { try { localStorage.setItem(CC_KEY, JSON.stringify(o)); } catch (e) {} }
  function hasConsent(cat) { if (cat === "zorunlu") return true; var c = ccGet(); return !!(c && c[cat]); }
  function ccRemove() { var h = document.getElementById("nx-cc"); if (h && h.parentNode) h.parentNode.removeChild(h); }
  function ccAll(v) { var o = {}; for (var i = 0; i < CC_CATS.length; i++) o[CC_CATS[i].k] = CC_CATS[i].locked ? true : v; return o; }
  function ccDecide(vals) { vals.zorunlu = true; vals.v = 1; ccSave(vals); ccRemove(); document.documentElement.classList.remove("nx-cc-on"); }
  function ccBtn(label, primary) {
    return '<button type="button" style="' + css({ padding: "9px 16px", fontFamily: C.mono, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", borderRadius: 3, cursor: "pointer", border: "1px solid " + (primary ? C.primary : C.borderStrong), background: primary ? C.primary : "transparent", color: primary ? C.deep : C.textSec }) + '">' + label + '</button>';
  }
  function ccBanner() {
    return '<div role="dialog" aria-label="Çerez bilgilendirmesi" style="' + css({ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 9998, background: C.raised, borderTop: "1px solid " + C.primary, boxShadow: "0 -8px 30px rgba(0,0,0,0.45)", padding: "16px" }) + '">'
      + '<div style="' + css({ maxWidth: 1280, margin: "0 auto", display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }) + '">'
      + '<p style="' + css({ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: C.textSec, flex: "1 1 320px" }) + '">Bu sitede çalışması için <strong style="' + css({ color: C.textPri }) + '">zorunlu çerezler</strong> ile onayınıza bağlı işlevsel/analitik/reklam çerezleri kullanılabilir. Zorunlu olmayan çerezler siz onay verene kadar çalışmaz. Ayrıntı: <a href="cerez.html" style="' + css({ color: C.primary, textDecoration: "none" }) + '">Çerez Politikası</a>.</p>'
      + '<div style="' + css({ display: "flex", gap: 8, flexWrap: "wrap" }) + '"><span data-cc="reject">' + ccBtn("Tümünü Reddet") + '</span><span data-cc="prefs">' + ccBtn("Tercihleri Yönet") + '</span><span data-cc="accept">' + ccBtn("Tümünü Kabul Et", true) + '</span></div>'
      + '</div></div>';
  }
  function ccPrefs(cur) {
    var rows = CC_CATS.map(function (c) {
      var on = c.locked ? true : !!(cur && cur[c.k]);
      return '<label style="' + css({ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid " + C.border, alignItems: "flex-start", cursor: c.locked ? "default" : "pointer" }) + '"><input type="checkbox" data-cc-cat="' + c.k + '"' + (on ? " checked" : "") + (c.locked ? " disabled" : "") + ' style="' + css({ marginTop: 3, accentColor: C.primary, width: 16, height: 16, flexShrink: 0 }) + '"><span><span style="' + css({ display: "block", fontFamily: "'Sora',sans-serif", fontSize: 13.5, fontWeight: 700, color: C.textPri }) + '">' + c.t + (c.locked ? ' <span style="' + css({ fontFamily: C.mono, fontSize: 9, color: C.accent, letterSpacing: "0.08em" }) + '">HER ZAMAN AÇIK</span>' : '') + '</span><span style="' + css({ display: "block", fontSize: 11.5, color: C.textMut, lineHeight: 1.5, marginTop: 2 }) + '">' + c.d + '</span></span></label>';
    }).join("");
    return '<div role="dialog" aria-modal="true" aria-label="Çerez tercihleri" style="' + css({ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(2,8,18,0.72)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }) + '" data-cc-overlay>'
      + '<div style="' + css({ background: C.base, border: "1px solid " + C.borderStrong, borderRadius: 6, maxWidth: 560, width: "100%", maxHeight: "86vh", overflowY: "auto", padding: "22px 22px 18px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }) + '">'
      + '<div style="' + css({ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 700, color: C.textPri, marginBottom: 6 }) + '">Çerez Tercihleri</div>'
      + '<p style="' + css({ fontSize: 12.5, color: C.textMut, lineHeight: 1.6, margin: "0 0 8px" }) + '">Zorunlu olmayan çerezleri kategori bazında yönetin. Ayrıntı: <a href="cerez.html" style="' + css({ color: C.primary, textDecoration: "none" }) + '">Çerez Politikası</a>.</p>'
      + rows
      + '<div style="' + css({ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end", marginTop: 16 }) + '"><span data-cc="reject">' + ccBtn("Tümünü Reddet") + '</span><span data-cc="save">' + ccBtn("Seçilenleri Kaydet") + '</span><span data-cc="accept">' + ccBtn("Tümünü Kabul Et", true) + '</span></div>'
      + '</div></div>';
  }
  function ccBind(host) {
    function on(sel, fn) { var e = host.querySelectorAll(sel); for (var i = 0; i < e.length; i++) e[i].addEventListener("click", fn); }
    on('[data-cc="accept"]', function () { ccDecide(ccAll(true)); });
    on('[data-cc="reject"]', function () { ccDecide(ccAll(false)); });
    on('[data-cc="prefs"]', function () { cookieConsent(true); });
    on('[data-cc="save"]', function () { var o = {}, b = host.querySelectorAll("[data-cc-cat]"); for (var i = 0; i < b.length; i++) o[b[i].getAttribute("data-cc-cat")] = b[i].checked; ccDecide(o); });
    var ov = host.querySelector("[data-cc-overlay]"); if (ov) ov.addEventListener("click", function (e) { if (e.target === ov && ccGet()) ccRemove(); });
  }
  function cookieConsent(forcePrefs) {
    if (!document.body) return;
    ccRemove();
    document.documentElement.classList.remove("nx-cc-on");
    var c = ccGet();
    if (c && !forcePrefs) return;
    var host = document.createElement("div"); host.id = "nx-cc";
    host.innerHTML = forcePrefs ? ccPrefs(c) : ccBanner();
    document.body.appendChild(host);
    ccBind(host);
    if (!forcePrefs) document.documentElement.classList.add("nx-cc-on");
  }

  injectBase();
  window.NX = {
    css: css, attr: attr, C: C, EMLAK_LOGO_URI: EMLAK_LOGO_URI, EmlakEkspertiziLogo: EmlakEkspertiziLogo,
    Eyebrow: Eyebrow, SectionDivider: SectionDivider, SubSection: SubSection,
    setAccent: setAccent, boot: boot, startClock: startClock, navHref: navHref,
    ProX: ProX, proxify: proxify,
    Ticker: Ticker, Masthead: Masthead, Nav: Nav, Footer: Footer,
    hasConsent: hasConsent, openCookiePrefs: function () { cookieConsent(true); },
  };
})();
