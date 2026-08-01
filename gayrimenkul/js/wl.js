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
var logo=((d.FIRMA&&d.FIRMA.logo)||'').toString();
var ORIG='Meridyen Gayrimenkul',OSHORT='Meridyen';
var customized=!(name===ORIG && il==='İzmir') || !!logo;   /* logo yüklüyse marka değişmese de uygula */
/* Yüklenen logo görseli için CSS (alt sayfa <style>'ına gerek yok) — ana site ile birebir */
try{if(!document.getElementById('wl-logo-css')){var _st=document.createElement('style');_st.id='wl-logo-css';_st.textContent='.logo .logo-img{height:40px;width:auto;max-width:200px;object-fit:contain;display:block}.logo.has-logo-img{gap:0}.logo.has-logo-img .mark,.logo.has-logo-img .js-logo,.logo.has-logo-img>span:not(.logo-img){display:none}footer .logo .logo-img{height:34px;max-width:180px}';(document.head||document.documentElement).appendChild(_st);}}catch(e){}
/* H10: yayınlanan tema (admin THEME) statik sayfalara da uygulanır — SPA'da "Gece Mor" seçilince
   index.html morarır AMA statik sayfalar mavi kalıyordu; artık aynı CSS değişkenleri burada da set edilir. */
try{var TH=(d.THEME&&d.THEME.accent)?d.THEME:null;if(TH){
  var _lx=function(h,a){var n=parseInt(h.slice(1),16),r=Math.min(255,(n>>16)+a),g=Math.min(255,((n>>8)&255)+a),b=Math.min(255,(n&255)+a);return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);};
  var _dk=function(h,a){var n=parseInt(h.slice(1),16),r=Math.max(0,(n>>16)-a),g=Math.max(0,((n>>8)&255)-a),b=Math.max(0,(n&255)-a);return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);};
  var rs=document.documentElement.style,ac=TH.accent,gr=TH.green||'#1e7e3a',nv=TH.navy||'#0f1f3d';
  rs.setProperty('--accent',ac);rs.setProperty('--accent-2',_lx(ac,18));
  rs.setProperty('--green',gr);rs.setProperty('--green-700',_dk(gr,16));rs.setProperty('--green-200',_lx(gr,34));
  rs.setProperty('--c-bg-navy',nv);rs.setProperty('--c-bg-deep',_dk(nv,6));
}}catch(e){}
/* Tipografi teması (statik sayfalar): d.THEME.font → Google Fonts yükle + gövde fontu (base.css'i kırmadan) */
try{var _tf=(d.THEME&&d.THEME.font)||'';var _CF={'Inter':'Inter:wght@400;500;600;700;800','Poppins':'Poppins:wght@400;500;600;700','Manrope':'Manrope:wght@400;500;600;700;800','Sora':'Sora:wght@400;500;600;700','DM Sans':'DM+Sans:wght@400;500;600;700','Nunito':'Nunito:wght@400;600;700;800','Montserrat':'Montserrat:wght@400;500;600;700','Figtree':'Figtree:wght@400;500;600;700','Playfair Display':'Playfair+Display:wght@500;600;700'};
if(_tf&&_CF[_tf]){var _lid='brand-font-'+_tf.replace(/\s+/g,'');if(!document.getElementById(_lid)){var _l=document.createElement('link');_l.rel='stylesheet';_l.id=_lid;_l.href='https://fonts.googleapis.com/css2?family='+_CF[_tf]+'&display=swap';(document.head||document.documentElement).appendChild(_l);}
  var _ap=function(){if(document.body)document.body.style.fontFamily="'"+_tf+"', system-ui, -apple-system, sans-serif";};if(document.body)_ap();else document.addEventListener('DOMContentLoaded',_ap);}}catch(e){}

/* ---- 2) Marka + gramerli şehir ---- */
var shortN=name.split(/\s+/)[0]||OSHORT;
function lv(w){var m=(w||'').toLowerCase().match(/[aeıioöuü]/g);return m?m[m.length-1]:'a';}
function bk(v){return 'aıou'.indexOf(v)>=0;}function ro(v){return 'ouöü'.indexOf(v)>=0;}
function I(v){return bk(v)?(ro(v)?'u':'ı'):(ro(v)?'ü':'i');}function A(v){return bk(v)?'a':'e';}
function ev(w){return /[aeıioöuü]$/i.test(w||'');}function hard(w){return 'pçtkfhsş'.indexOf((w||'').slice(-1).toLowerCase())>=0;}
function sfx(c,t){if(window.TRG)return window.TRG.suffix(c,t);var v=lv(c),V=ev(c),D=hard(c)?'t':'d';return t=='gen'?(V?'n':'')+I(v)+'n':t=='dat'?(V?'y':'')+A(v):t=='acc'?(V?'y':'')+I(v):t=='loc'?D+A(v):t=='abl'?D+A(v)+'n':t=='li'?'l'+I(v):'';}
function city(s){if(il==='İzmir')return s;if(window.TRG&&window.TRG.city){if(s.indexOf('İzmir')>=0||s.indexOf('İZMİR')>=0)s=window.TRG.city(s,il);if(window.TRG.districts)s=window.TRG.districts(s,il);if(window.TRG.region)s=window.TRG.region(s,il);/* H9: "Ege Bölgesi"→hedef bölge (İzmir yokken de) */return s;}if(s.indexOf('İzmir')<0&&s.indexOf('İZMİR')<0)return s;var c=il;
  s=s.replace(/İzmir ve Ege bölgesinde/g,c+"'"+sfx(c,'loc')).replace(/İzmir ve Ege['’]de/g,c+"'"+sfx(c,'loc')).replace(/İzmir ve Ege['’]den/g,c+"'"+sfx(c,'abl')).replace(/İzmir ve Ege['’]nin/g,c+"'"+sfx(c,'gen')).replace(/İzmir ve Ege['’]ye/g,c+"'"+sfx(c,'dat'))
   .split('İzmir ve Ege bölgesi').join(c).split('İzmir ve Ege').join(c+' ve çevresi').split('İzmir & Ege').join(c);
  s=s.replace(/İzmir['’](nin|nın|nun|nün|in|ın|un|ün)\b/g,c+"'"+sfx(c,'gen')).replace(/İzmir['’](den|dan|ten|tan)\b/g,c+"'"+sfx(c,'abl')).replace(/İzmir['’](deki|daki|teki|takı)\b/g,c+"'"+sfx(c,'loc')+'ki').replace(/İzmir['’](de|da|te|ta)\b/g,c+"'"+sfx(c,'loc')).replace(/İzmir['’](ya|ye|a|e)\b/g,c+"'"+sfx(c,'dat')).replace(/İzmir['’](yı|yi|yu|yü|ı|i|u|ü)\b/g,c+"'"+sfx(c,'acc')).replace(/İzmir['’]?li\b/g,c+sfx(c,'li'))
   .split('İZMİR').join((c||'').toLocaleUpperCase('tr')).replace(/İzmir/g,c);
  return s;}
function rep(s){if(!s||typeof s!=='string')return s;if(name!==ORIG&&s.indexOf('Meridyen')>=0)s=s.split(ORIG).join(name).split(OSHORT).join(shortN);return city(s);}

var obs=null,to=null;
function sweep(){if(!customized)return;if(obs)obs.disconnect();try{
  var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false),ns=[],n;
  while(n=w.nextNode()){var t=n.nodeValue;if(t&&(t.indexOf('Meridyen')>=0||(il!=='İzmir'&&(t.indexOf('İzmir')>=0||t.indexOf('İZMİR')>=0||t.indexOf('Ege')>=0||(window.TRG&&window.TRG.hasIzmirPlace&&window.TRG.hasIzmirPlace(t))))))ns.push(n);}/* H9: "Ege" içeren düğümler de yerelleşsin */
  ns.forEach(function(t){t.nodeValue=rep(t.nodeValue);});
  document.querySelectorAll('[title],[alt],[placeholder],[aria-label]').forEach(function(el){['title','alt','placeholder','aria-label'].forEach(function(a){var v=el.getAttribute(a);if(v&&(v.indexOf('Meridyen')>=0||v.indexOf('İzmir')>=0||v.indexOf('İZMİR')>=0))el.setAttribute(a,rep(v));});});
  /* logo: TÜM .logo öğeleri (header + footer) BİREBİR — yüklü görsel varsa <img>, yoksa baş harf + tam ad.
     (Eski kod document.querySelector TEKİL kullanıyordu → footer logosu "M" kalıyordu.) */
  try{
    var esc=function(x){return (x||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');};
    var jlH=null;if(name!==ORIG){var ps=name.split(/\s+/);var last=ps.length>1?ps[ps.length-1]:'';var head=ps.length>1?ps.slice(0,-1).join(' '):name;jlH=esc(head)+(last?'<span class="lo2"> '+esc(last)+'</span>':'');}
    var lt=shortN.charAt(0).toLocaleUpperCase('tr');
    document.querySelectorAll('.logo').forEach(function(lo){
      var mk=lo.querySelector('.mark'),jl=lo.querySelector('.js-logo');
      if(logo){lo.classList.add('has-logo-img');var im=lo.querySelector('img.logo-img');if(!im){im=document.createElement('img');im.className='logo-img';im.setAttribute('alt',name||'logo');lo.insertBefore(im,lo.firstChild);}if(im.getAttribute('src')!==logo)im.setAttribute('src',logo);}
      else{lo.classList.remove('has-logo-img');var i2=lo.querySelector('img.logo-img');if(i2&&i2.parentNode)i2.parentNode.removeChild(i2);if(mk&&name!==ORIG)mk.textContent=lt;}
      if(jl&&jlH!=null)jl.innerHTML=jlH;
    });
  }catch(e){}
  if(document.title.indexOf('Meridyen')>=0||(il!=='İzmir'&&(document.title.indexOf('İzmir')>=0||document.title.indexOf('İZMİR')>=0)))document.title=rep(document.title);
  document.querySelectorAll('meta[content]').forEach(function(m){var v=m.getAttribute('content');if(v&&(v.indexOf('Meridyen')>=0||v.indexOf('İzmir')>=0||v.indexOf('İZMİR')>=0||(il!=='İzmir'&&v.indexOf('Ege')>=0)))m.setAttribute('content',rep(v));});
  document.querySelectorAll('script[type="application/ld+json"]').forEach(function(s){var v=s.textContent;if(v&&(v.indexOf('Meridyen')>=0||(il!=='İzmir'&&(v.indexOf('İzmir')>=0||v.indexOf('İZMİR')>=0||v.indexOf('Ege')>=0))))s.textContent=rep(v);});
}catch(e){}if(obs)obs.observe(document.body,{childList:true,subtree:true});}

/* ---- 4) nedenbiz Bölge Hakimiyeti ---- */
/* H8: gerçek ProX bölge paketi (wl_bolge) yokken, İzmir'e özgü sabit içeriği hedef ilin
   GERÇEK ilçeleriyle GENEL, coğrafi olarak doğru içerikle değiştirir (İzmir landmark sızıntısını önler). */
function buildBolgeFallback(il,esc,BOLT){
  var ilList=(window.TR_ILILCE&&window.TR_ILILCE[il]&&window.TR_ILILCE[il].ilce)||[];
  var loc=(window.TRG?il+"'"+window.TRG.suffix(il,'loc'):il);
  var gen=(window.TRG?il+"'"+window.TRG.suffix(il,'gen'):il+"'in");
  var dist=document.querySelector('.nb-districts');
  if(dist){var pick=ilList.length?ilList.slice(0,6):[il+' Merkez'];
    dist.innerHTML=pick.map(function(ic){return '<div class="nb-dist reveal in"><div class="hd"><span class="nm">'+esc(ic)+'</span><span class="tr">▲ Talep</span></div><p class="ol">'+esc(ic)+' ve çevresinde konut ile yatırım talebini saha ve veriyle yakından izliyoruz.</p><div class="di">Güncel m² ve fiyat verisi ProX endeksinden alınır.</div></div>';}).join('');}
  var dp=document.querySelector('.nb-dpoints');
  if(dp){var dpts=[{deger:'ProX',baslik:'Canlı Bölge Verisi',aciklama:loc+' mahalle bazında fiyat ve talep göstergeleri ProX endeksinden güncellenir.'},{deger:'%100',baslik:'Yerel Uzmanlık',aciklama:il+' ve çevresinde saha deneyimi ve bölge hakimiyeti.'},{deger:'7/24',baslik:'Şeffaf Süreç',aciklama:'Her adımda yazılı bilgi, doğrulanabilir kayıt ve net raporlama.'}];
    dp.innerHTML=dpts.map(function(x){return '<div class="nb-dpoint reveal in"><b>'+esc(x.deger)+'</b><div class="t">'+esc(x.baslik)+'</div><div class="d">'+esc(x.aciklama)+'</div></div>';}).join('');}
  var ins=document.querySelector('.nb-insights');
  if(ins){var inss=[{baslik:'Veriyle Konumlama',metin:gen+' genelinde mahalle bazında fiyat ve talep eğilimlerini izleyerek doğru bölgeyi öneriyoruz.'},{baslik:'Doğru Zamanlama',metin:'Alım-satım kararlarını bölgesel momentum ve ProX veri konsensüsüyle destekliyoruz.'}];
    ins.innerHTML=inss.map(function(x){return '<div class="nb-insight reveal in">'+BOLT+'<div><h4>'+esc(x.baslik)+'</h4><p>'+esc(x.metin)+'</p></div></div>';}).join('');}
  var projWrap=document.querySelector('.nb-projects');
  if(projWrap){projWrap.style.display='none';var ph=projWrap.previousElementSibling;if(ph&&ph.tagName==='H3'&&/proje/i.test(ph.textContent))ph.style.display='none';}
}
function buildBolge(){try{
  var pack=null;try{pack=JSON.parse(localStorage.getItem('wl_bolge')||'null');}catch(e){}
  function esc(t){return (t==null?'':(''+t)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  var BOLT='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>';
  var havePack=pack&&pack.il&&pack.il!=='İzmir'&&pack.cards&&pack.cards.length;
  if(!havePack){
    /* İzmir kiracı → sabit içerik doğru, dokunma. Non-İzmir + gerçek paket yok →
       H8: İzmir'e özgü sabit "Bölge Hakimiyeti" içeriğini (Bayraklı MİA, Adnan Menderes Havalimanı,
       Çeşme-Alaçatı, 21+ fay hattı…) GENEL, yerelleştirilmiş, coğrafi olarak doğru içerikle değiştir. */
    if(il==='İzmir')return;
    try{buildBolgeFallback(il,esc,BOLT);}catch(e){}
    return;
  }
  var dist=document.querySelector('.nb-districts');
  if(dist)dist.innerHTML=pack.cards.map(function(c){return '<div class="nb-dist reveal in"><div class="hd"><span class="nm">'+esc(c.ad)+'</span><span class="tr">'+esc(c.trend)+'</span></div><p class="ol">'+esc(c.one_liner)+'</p><div class="di">'+esc(c.deger_ipucu)+'</div></div>';}).join('');
  var dp=document.querySelector('.nb-dpoints');
  if(dp&&pack.dpoints)dp.innerHTML=pack.dpoints.map(function(x){return '<div class="nb-dpoint reveal in"><b>'+esc(x.deger)+'</b><div class="t">'+esc(x.baslik)+'</div><div class="d">'+esc(x.aciklama)+'</div></div>';}).join('');
  var ins=document.querySelector('.nb-insights');
  if(ins&&pack.insights&&pack.insights.length)ins.innerHTML=pack.insights.map(function(x){return '<div class="nb-insight reveal in">'+BOLT+'<div><h4>'+esc(x.baslik)+'</h4><p>'+esc(x.metin)+'</p></div></div>';}).join('');
  var projWrap=document.querySelector('.nb-projects');
  if(projWrap){projWrap.style.display='none';var ph=projWrap.previousElementSibling;if(ph&&ph.tagName==='H3'&&/proje/i.test(ph.textContent))ph.style.display='none';}
}catch(e){}}

/* ---- 5) H10: statik sayfa çok-dilli (GERÇEK AI çeviri) — SPA gmLang paritesi, kendi kapsamlı.
   Bozuk "İngilizce yakında" alert stub'ı yerine: proxApi (sayfa-içi ProX) ile TR→EN/AR,
   sayfa+dil bazlı cache, AR için RTL. Servis yoksa TR'ye nazikçe döner. */
var _i18nOrig=null;
function _pageKey(){return (location.pathname.split('/').pop()||'index');}
function _i18nNodes(){
  var sels=['.siteNav a','.hero h1','.hero h2','.hero .lead','.hero p','h1','h2','h3','.lead','.sec-lead','.svc-lead','summary','.btn','.btn-primary','.chip','.nb-dist .ol','.nb-insight p','.nb-dpoint .d'];
  var set=[],seen=[];
  sels.forEach(function(s){try{document.querySelectorAll(s).forEach(function(el){
    if(el.children.length===0){var t=(el.textContent||'').trim();if(t&&t.length>1&&t.length<220&&/[a-zçğıöşü]/i.test(t)&&seen.indexOf(el)<0){seen.push(el);set.push(el);}}
  });}catch(e){}});
  return set.slice(0,60);
}
async function wlLang(v){
  var sel=document.querySelectorAll('.lang-sw select');
  if(v==='tr'){if(_i18nOrig)_i18nOrig.forEach(function(o){o.el.textContent=o.txt;});document.documentElement.setAttribute('dir','ltr');document.documentElement.lang='tr';try{localStorage.setItem('wl_lang','tr');}catch(e){}sel.forEach(function(s){s.value='tr';});return;}
  if(!_i18nOrig)_i18nOrig=_i18nNodes().map(function(el){return {el:el,txt:el.textContent};});
  if(!_i18nOrig.length){sel.forEach(function(s){s.value='tr';});return;}
  document.documentElement.setAttribute('dir',v==='ar'?'rtl':'ltr');document.documentElement.lang=v;sel.forEach(function(s){s.value=v;});
  var texts=_i18nOrig.map(function(o){return o.txt;});
  var ckey='wl_i18n_'+_pageKey()+'_'+v,cache=null;try{cache=JSON.parse(localStorage.getItem(ckey)||'null');}catch(e){}
  if(cache&&cache.n===texts.length){cache.tr.forEach(function(t,i){if(_i18nOrig[i]&&t)_i18nOrig[i].el.textContent=t;});try{localStorage.setItem('wl_lang',v);}catch(e){}return;}
  if(typeof proxApi!=='function'){document.documentElement.setAttribute('dir','ltr');document.documentElement.lang='tr';sel.forEach(function(s){s.value='tr';});return;}
  var langName=v==='ar'?'Modern Standard Arabic':'English';
  var prompt='Translate these Turkish real-estate website UI strings to '+langName+'. Keep the brand name "'+(name||'')+'" and city/proper nouns unchanged. Return ONLY a numbered list, exactly one translation per line, SAME count and order, no commentary:\n'+texts.map(function(t,i){return (i+1)+'. '+t;}).join('\n');
  var outTxt=null;
  try{var r=await proxApi('/api/v1/tenant/prox/ai',{method:'POST',body:{persona:'office',tool:'translate',prompt:prompt}});if(r&&!r.fallback)outTxt=r.answer||r.text||(r.data&&(r.data.answer||r.data.text));}catch(e){}
  if(!outTxt){document.documentElement.setAttribute('dir','ltr');document.documentElement.lang='tr';sel.forEach(function(s){s.value='tr';});try{if(typeof toast==='function')toast('Çeviri servisi şu an kullanılamıyor.');}catch(e){}return;}
  var lines=outTxt.split('\n').map(function(l){return l.replace(/^\s*\d+[.)]\s*/,'').trim();}).filter(function(l){return l;});
  var applied=_i18nOrig.map(function(o,i){var t=lines[i]||o.txt;if(lines[i])o.el.textContent=lines[i];return t;});
  try{localStorage.setItem(ckey,JSON.stringify({n:texts.length,tr:applied}));localStorage.setItem('wl_lang',v);}catch(e){}
}
try{window.gmLang=wlLang;}catch(e){}   /* statik "yakında" stub'ını gerçek çeviriyle değiştir */

/* Sosyal medya (statik sayfalar): FIRMA.social'dan href yaz; boşsa demo linkini gizle (tenant'ta Meridyen'e gitmesin) */
function applySocialWL(){try{var S=(d.FIRMA&&d.FIRMA.social)||{};if(!customized)return;
  [['fb','facebook.com/meridyengayrimenkul'],['ig','instagram.com/meridyengayrimenkul'],['x','x.com/meridyengm'],['li','linkedin.com/company/meridyengayrimenkul'],['yt','youtube.com/@meridyengayrimenkul']].forEach(function(m){
    var v=(S[m[0]]||'').trim();
    document.querySelectorAll('a[href*="'+m[1]+'"]').forEach(function(a){
      if(v){a.href=/^https?:\/\//i.test(v)?v:('https://'+v.replace(/^\/+/,''));a.style.display='';}else{a.style.display='none';}
    });
  });
}catch(e){}}
function start(){buildBolge();sweep();applySocialWL();if(customized&&'MutationObserver' in window){obs=new MutationObserver(function(){clearTimeout(to);to=setTimeout(function(){sweep();},150);});obs.observe(document.body,{childList:true,subtree:true});}setTimeout(function(){buildBolge();sweep();},400);
  /* kaydedilmiş dil TR değilse otomatik uygula (SPA ile tutarlı çok-dillilik) */
  try{var _sv=localStorage.getItem('wl_lang');if(_sv&&_sv!=='tr')setTimeout(function(){try{wlLang(_sv);}catch(e){}},550);}catch(e){}}
if(document.readyState!=='loading')start();else document.addEventListener('DOMContentLoaded',start);

}catch(e){}
})();
