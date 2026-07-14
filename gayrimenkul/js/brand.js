/* ===================================================================
   brand.js — Tarayıcı logosu (favicon) + Google arama logosu (Organization)
   Yönetimi ADMİN panelinden yapılır; TÜM sayfalarda uygulanır.
   Depo: localStorage["gm_brand"] = { favicon:<dataURI|url>, googleLogo:<dataURI|url> }
   Bağımsız (app.js gerektirmez) — her sayfanın <head>'inde yüklenir.
   =================================================================== */
(function () {
  var KEY = "gm_brand";
  var DEFAULT_FAVICON = "favicon.svg";
  var ORG = { type: "RealEstateAgent", name: "Meridyen Gayrimenkul" };

  function get() { try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; } }
  function abs(u) { try { return new URL(u, location.href).href; } catch (e) { return u; } }

  function setLink(rel, href, type) {
    var l = document.querySelector('link[rel="' + rel + '"]');
    if (!l) { l = document.createElement("link"); l.setAttribute("rel", rel); document.head.appendChild(l); }
    l.setAttribute("href", href);
    if (type) l.setAttribute("type", type); else l.removeAttribute("type");
  }

  function applyFavicon(url) {
    var isSvg = /\.svg(\?|$)/i.test(url) || /^data:image\/svg/i.test(url);
    setLink("icon", url, isSvg ? "image/svg+xml" : "");
    setLink("apple-touch-icon", url);
  }

  function applyOrg(logo) {
    var id = "gm-org-ld", s = document.getElementById(id);
    if (!s) { s = document.createElement("script"); s.type = "application/ld+json"; s.id = id; document.head.appendChild(s); }
    var homeUrl = location.origin + location.pathname.replace(/[^/]*$/, "") + "index.html";
    s.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": ORG.type,
      "name": ORG.name,
      "url": homeUrl,
      "logo": abs(logo),
      "image": abs(logo)
    });
  }

  function apply() {
    var b = get();
    applyFavicon(b.favicon || DEFAULT_FAVICON);
    applyOrg(b.googleLogo || b.favicon || DEFAULT_FAVICON);
  }

  /* ---- ADMİN API ---- */
  window.gmSetBrand = function (o) {
    var b = get();
    if (o && "favicon" in o) b.favicon = o.favicon;
    if (o && "googleLogo" in o) b.googleLogo = o.googleLogo;
    try { localStorage.setItem(KEY, JSON.stringify(b)); } catch (e) { if (window.toast) toast("Kaydedilemedi (depolama kotası)."); }
    apply();
    return b;
  };
  window.gmGetBrand = get;
  window.gmBrandUpload = function (input, which) {
    var f = input && input.files && input.files[0]; if (!f) return;
    if (f.size > 512 * 1024) { if (window.toast) toast("Görsel çok büyük (max 512 KB). PNG/SVG önerilir."); return; }
    var r = new FileReader();
    r.onload = function () { var o = {}; o[which] = r.result; window.gmSetBrand(o); if (window.toast) toast(which === "googleLogo" ? "Google arama logosu güncellendi." : "Tarayıcı logosu (favicon) güncellendi."); };
    r.readAsDataURL(f);
  };
  window.gmBrandReset = function (which) {
    var b = get(); if (which) delete b[which]; else b = {};
    try { localStorage.setItem(KEY, JSON.stringify(b)); } catch (e) {}
    apply(); if (window.toast) toast("Varsayılan logoya dönüldü.");
  };

  apply();
})();
