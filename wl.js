/* ===================================================================
   wl.js — White-label alt sayfa motoru (TEK KAYNAK)
   hizmetlerimiz.html + nedenbiz.html tarafından yüklenir.
   Görevleri:
   1) Canonical + og:url = deploy edilen domain (her zaman)
   2) Marka + şehir (gramerli) dönüşümü: config'ten (localStorage) oku,
      "Meridyen Gayrimenkul" → firma adı, "İzmir" → aktif il (Türkçe ek uyumlu)
   3) JSON-LD + meta + logo (tam ad) güncelle + MutationObserver
   4) nedenbiz Bölge Hakimiyeti kartlarını wl_bolge (gerçek ProX verisi) ile kur
   =================================================================== */
(function(){
"use strict";
try{

/* ---- 1) Canonical + og:url (her zaman, white-label olsun olmasın) ---- */
(function(){try{var url=location.origin+location.pathname;
  function setL(rel,href){var l=document.querySelector('link[rel="'+rel+'"]');if(!l){l=document.createElement('link');l.setAttribute('rel',rel);document.head.appendChild(l);}l.setAttribute('href',href);}
  setL('canonical',url);
  function setM(pr,val){var m=document.querySelector('meta[property="'+pr+'"]');if(!m){m=document.createElement('meta');m.setAttribute('property',pr);document.head.appendChild(m);}m.setAttribute('content',val);}
  setM('og:url',url);
}catch(e){}})();

/* ---- config ---- */
var d={};try{d=JSON.parse(localStorage.getItem('meridyenGM_v1')||'{}');}catch(e){}
var name=((d.FIRMA&&d.FIRMA.name)||'Meridyen Gayrimenkul').trim();
var il=((d.PROX&&(d.PROX.il||d.PROX.region))||'İzmir');
var ORIG='Meridyen Gayrimenkul',OSHORT='Meridyen';
var customized=!(name===ORIG && il==='İzmir');

/* ---- 2) Marka + gramerli şehir ---- */
var shortN=name.split(/\s+/)[0]||OSHORT;
function lv(w){var m=(w||'').toLowerCase().match(/[aeıioöuü]/g);return m?m[m.length-1]:'a';}
function bk(v){return 'aıou'.indexOf(v)>=0;}function ro(v){return 'ouöü'.indexOf(v)>=0;}
function I(v){return bk(v)?(ro(v)?'u':'ı'):(ro(v)?'ü':'i');}function A(v){return bk(v)?'a':'e';}
function ev(w){return /[aeıioöuü]$/i.test(w||'');}function hard(w){return 'pçtkfhsş'.indexOf((w||'').slice(-1).toLowerCase())>=0;}
function sfx(c,t){var v=lv(c),V=ev(c),D=hard(c)?'t':'d';return t=='gen'?(V?'n':'')+I(v)+'n':t=='dat'?(V?'y':'')+A(v):t=='acc'?(V?'y':'')+I(v):t=='loc'?D+A(v):t=='abl'?D+A(v)+'n':t=='li'?'l'+I(v):'';}
function city(s){if(il==='İzmir'||(s.indexOf('İzmir')<0&&s.indexOf('İZMİR')<0))return s;var c=il;
  s=s.replace(/İzmir ve Ege bölgesinde/g,c+"'"+sfx(c,'loc')).replace(/İzmir ve Ege['’]de/g,c+"'"+sfx(c,'loc')).replace(/İzmir ve Ege['’]den/g,c+"'"+sfx(c,'abl')).replace(/İzmir ve Ege['’]nin/g,c+"'"+sfx(c,'gen')).replace(/İzmir ve Ege['’]ye/g,c+"'"+sfx(c,'dat'))
   .split('İzmir ve Ege bölgesi').join(c).split('İzmir ve Ege').join(c+' ve çevresi').split('İzmir & Ege').join(c);
  s=s.replace(/İzmir['’](nin|nın|nun|nün|in|ın|un|ün)\b/g,c+"'"+sfx(c,'gen')).replace(/İzmir['’](den|dan|ten|tan)\b/g,c+"'"+sfx(c,'abl')).replace(/İzmir['’](deki|daki|teki|takı)\b/g,c+"'"+sfx(c,'loc')+'ki').replace(/İzmir['’](de|da|te|ta)\b/g,c+"'"+sfx(c,'loc')).replace(/İzmir['’](ya|ye|a|e)\b/g,c+"'"+sfx(c,'dat')).replace(/İzmir['’](yı|yi|yu|yü|ı|i|u|ü)\b/g,c+"'"+sfx(c,'acc')).replace(/İzmir['’]?li\b/g,c+sfx(c,'li'))
   .split('İZMİR').join((c||'').toLocaleUpperCase('tr')).replace(/İzmir/g,c);
  return s;}
function rep(s){if(!s||typeof s!=='string')return s;if(name!==ORIG&&s.indexOf('Meridyen')>=0)s=s.split(ORIG).join(name).split(OSHORT).join(shortN);return city(s);}

var obs=null,to=null;
function sweep(){if(!customized)return;if(obs)obs.disconnect();try{
  var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false),ns=[],n;
  while(n=w.nextNode()){var t=n.nodeValue;if(t&&(t.indexOf('Meridyen')>=0||(il!=='İzmir'&&(t.indexOf('İzmir')>=0||t.indexOf('İZMİR')>=0))))ns.push(n);}
  ns.forEach(function(t){t.nodeValue=rep(t.nodeValue);});
  document.querySelectorAll('[title],[alt],[placeholder],[aria-label]').forEach(function(el){['title','alt','placeholder','aria-label'].forEach(function(a){var v=el.getAttribute(a);if(v&&(v.indexOf('Meridyen')>=0||v.indexOf('İzmir')>=0||v.indexOf('İZMİR')>=0))el.setAttribute(a,rep(v));});});
  /* logo: tam ad (mark = baş harf, metin = tam ad) */
  try{var mk=document.querySelector('.logo .mark');if(mk&&name!==ORIG)mk.textContent=shortN.charAt(0).toLocaleUpperCase('tr');
    var jl=document.querySelector('.js-logo');if(jl&&name!==ORIG){var ps=name.split(/\s+/);var last=ps.length>1?ps[ps.length-1]:'';var head=ps.length>1?ps.slice(0,-1).join(' '):name;var esc=function(x){return (x||'').replace(/&/g,'&amp;').replace(/</g,'&lt;');};jl.innerHTML=esc(head)+(last?'<span class="lo2"> '+esc(last)+'</span>':'');}}catch(e){}
  if(document.title.indexOf('Meridyen')>=0||(il!=='İzmir'&&(document.title.indexOf('İzmir')>=0||document.title.indexOf('İZMİR')>=0)))document.title=rep(document.title);
  document.querySelectorAll('meta[content]').forEach(function(m){var v=m.getAttribute('content');if(v&&(v.indexOf('Meridyen')>=0||v.indexOf('İzmir')>=0||v.indexOf('İZMİR')>=0))m.setAttribute('content',rep(v));});
  document.querySelectorAll('script[type="application/ld+json"]').forEach(function(s){var v=s.textContent;if(v&&(v.indexOf('Meridyen')>=0||(il!=='İzmir'&&(v.indexOf('İzmir')>=0||v.indexOf('İZMİR')>=0))))s.textContent=rep(v);});
}catch(e){}if(obs)obs.observe(document.body,{childList:true,subtree:true,characterData:true});}

/* ---- 4) nedenbiz Bölge Hakimiyeti — gerçek ProX verisi (wl_bolge) ---- */
function buildBolge(){try{
  var pack=null;try{pack=JSON.parse(localStorage.getItem('wl_bolge')||'null');}catch(e){}
  if(!pack||!pack.il||pack.il==='İzmir'||!pack.cards||!pack.cards.length)return;
  function esc(t){return (t==null?'':(''+t)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  var BOLT='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>';
  var dist=document.querySelector('.nb-districts');
  if(dist)dist.innerHTML=pack.cards.map(function(c){return '<div class="nb-dist reveal in"><div class="hd"><span class="nm">'+esc(c.ad)+'</span><span class="tr">'+esc(c.trend)+'</span></div><p class="ol">'+esc(c.one_liner)+'</p><div class="di">'+esc(c.deger_ipucu)+'</div></div>';}).join('');
  var dp=document.querySelector('.nb-dpoints');
  if(dp&&pack.dpoints)dp.innerHTML=pack.dpoints.map(function(x){return '<div class="nb-dpoint reveal in"><b>'+esc(x.deger)+'</b><div class="t">'+esc(x.baslik)+'</div><div class="d">'+esc(x.aciklama)+'</div></div>';}).join('');
  var ins=document.querySelector('.nb-insights');
  if(ins&&pack.insights&&pack.insights.length)ins.innerHTML=pack.insights.map(function(x){return '<div class="nb-insight reveal in">'+BOLT+'<div><h4>'+esc(x.baslik)+'</h4><p>'+esc(x.metin)+'</p></div></div>';}).join('');
  var projWrap=document.querySelector('.nb-projects');
  if(projWrap){projWrap.style.display='none';var ph=projWrap.previousElementSibling;if(ph&&ph.tagName==='H3'&&/proje/i.test(ph.textContent))ph.style.display='none';}
}catch(e){}}

function start(){buildBolge();sweep();if(customized&&'MutationObserver' in window){obs=new MutationObserver(function(){clearTimeout(to);to=setTimeout(function(){sweep();},150);});obs.observe(document.body,{childList:true,subtree:true,characterData:true});}setTimeout(function(){buildBolge();sweep();},400);}
if(document.readyState!=='loading')start();else document.addEventListener('DOMContentLoaded',start);

}catch(e){}
})();
