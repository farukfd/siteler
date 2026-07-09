/* Meridyen Gayrimenkul — STATİK SEO SAYFALARI için minik ÜYELİK ROZETİ.
   Nav/footer artık STATİK canonical (app.js kaynağıyla birebir). Bu script yalnızca:
   giriş yapılmışsa üst menüdeki "Giriş"i kullanıcı adına + yeşil noktaya çevirir ve Hesap'a yönlendirir
   (index ile birebir aynı görünüm). app.js/proxApi'ye BAĞIMLI DEĞİL. */
(function () {
  'use strict';
  function firstName(n) { return (String(n || '').trim().split(/\s+/)[0]) || 'Hesabım'; }
  function session() { try { return JSON.parse(localStorage.getItem('gm_session_v1') || 'null'); } catch (e) { return null; } }
  function run() {
    try {
      if (!document.getElementById('gsc-auth-css')) {
        var st = document.createElement('style'); st.id = 'gsc-auth-css';
        st.textContent = '.js-giris.logged::before{content:"";display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--green,#34a853);margin-right:7px;vertical-align:middle}';
        (document.head || document.documentElement).appendChild(st);
      }
      var s = session();
      document.querySelectorAll('.js-giris').forEach(function (g) {
        if (s) {
          g.textContent = firstName(s.name);
          g.classList.add('logged');
          g.setAttribute('href', 'index.html#hesap');
          g.setAttribute('title', (s.name || '') + ' · ' + (s.email || ''));
          g.onclick = function (e) { if (e && e.preventDefault) e.preventDefault(); location.href = 'index.html#hesap'; return false; };
        }
      });
    } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  window.addEventListener('load', run);
})();
