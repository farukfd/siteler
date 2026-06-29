/* Meridyen Değerleme — kurumsal site JS (sade, çerçevesiz). */
(function () {
  'use strict';
  // Mobil menü
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () { nav.classList.toggle('open'); });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }
  // Aktif link (geçerli sayfa)
  var here = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav a[href]').forEach(function (a) {
    if (a.getAttribute('href') === here) a.classList.add('active');
  });
})();
