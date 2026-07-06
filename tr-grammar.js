/* ===================================================================
   tr-grammar.js — Türkçe ek uyumu + şehir dönüşümü (TEK KAYNAK)
   gayrimenkul.html + wl.js tarafından yüklenir. Saf/parametreli;
   DOM/durum bağımlılığı YOK. window.TRG olarak açılır.
   Not: gayrimenkul.html ve wl.js, TRG yoksa kendi inline kopyalarına
   düşer (dayanıklılık) — bu dosya yüklendiğinde tek otorite budur.
   =================================================================== */
(function(){
"use strict";
function lastVowel(w){var m=(w||'').toLowerCase().match(/[aeıioöuü]/g);return m?m[m.length-1]:'a';}
function back(v){return 'aıou'.indexOf(v)>=0;}
function round(v){return 'ouöü'.indexOf(v)>=0;}
function I(v){return back(v)?(round(v)?'u':'ı'):(round(v)?'ü':'i');}
function A(v){return back(v)?'a':'e';}
function endsVowel(w){return /[aeıioöuü]$/i.test(w||'');}
function hard(w){var c=(w||'').replace(/['’]/g,'').slice(-1).toLowerCase();return 'pçtkfhsş'.indexOf(c)>=0;}
/* type: gen|dat|acc|loc|abl|li → şehir için doğru ek (sert ünsüz=t, yumuşak=d) */
function suffix(city,type){var v=lastVowel(city),vwl=endsVowel(city),D=hard(city)?'t':'d';
  switch(type){case 'gen':return (vwl?'n':'')+I(v)+'n';case 'dat':return (vwl?'y':'')+A(v);
   case 'acc':return (vwl?'y':'')+I(v);case 'loc':return D+A(v);case 'abl':return D+A(v)+'n';
   case 'li':return 'l'+I(v);}return '';}
/* "İzmir" / "İzmir ve Ege" kalıplarını hedef şehre (gramerli) çevirir. c=hedef il adı. */
function city(s,c){if(!s||typeof s!=='string'||!c||(s.indexOf('İzmir')<0&&s.indexOf('İZMİR')<0))return s;
  s=s.split('İzmir ve Ege bölgesi').join(c+' ve çevresi').split('İzmir ve Ege').join(c+' ve çevresi').split('İzmir & Ege').join(c+' & çevresi').split('İzmir ve çevresi').join(c+' ve çevresi');
  s=s.replace(/İzmir['’](nin|nın|nun|nün|in|ın|un|ün)\b/g,c+"'"+suffix(c,'gen'));
  s=s.replace(/İzmir['’](den|dan|ten|tan)\b/g,c+"'"+suffix(c,'abl'));
  s=s.replace(/İzmir['’](deki|daki|teki|takı)\b/g,c+"'"+suffix(c,'loc')+'ki');
  s=s.replace(/İzmir['’](de|da|te|ta)\b/g,c+"'"+suffix(c,'loc'));
  s=s.replace(/İzmir['’](ya|ye|a|e)\b/g,c+"'"+suffix(c,'dat'));
  s=s.replace(/İzmir['’](yı|yi|yu|yü|ı|i|u|ü)\b/g,c+"'"+suffix(c,'acc'));
  s=s.replace(/İzmir['’]?li\b/g,c+suffix(c,'li'));
  s=s.split('İZMİR').join((c||'').toLocaleUpperCase('tr'));
  s=s.replace(/İzmir/g,c);
  return s;}
/* İçerikteki İzmir ilçe/semt adlarını → hedef ilin ilçelerine (konumsal, deterministik) çevirir.
   White-label'da "Konak, Karşıyaka, Bornova…" gibi sabit İzmir yerleri seçilen ile uyarlanır. */
var IZMIR_PLACES=['Konak','Karşıyaka','Bornova','Buca','Çeşme','Bayraklı','Gaziemir','Karabağlar','Menemen','Torbalı','Urla','Bayındır','Ödemiş','Tire','Foça','Aliağa','Çiğli','Narlıdere','Balçova','Güzelbahçe','Seferihisar','Selçuk','Bergama','Menderes','Kemalpaşa','Alsancak','Bostanlı','Göztepe','Mavişehir','Güzelyalı','Bergama'];
var _trLet='a-zçğıöşüA-ZÇĞİÖŞÜ';
var _izReCache=new RegExp('(?:'+IZMIR_PLACES.join('|')+')');
function hasIzmirPlace(s){return typeof s==='string'&&_izReCache.test(s);}
function _dList(targetIl){try{var r=(typeof window!=='undefined'&&window.TR_ILILCE&&window.TR_ILILCE[targetIl]);return (r&&r.ilce&&r.ilce.length)?r.ilce:null;}catch(e){return null;}}
function districts(s,targetIl){if(!s||typeof s!=='string'||!targetIl||targetIl==='İzmir')return s;var tgt=_dList(targetIl);if(!tgt)return s;
  for(var i=0;i<IZMIR_PLACES.length;i++){var pl=IZMIR_PLACES[i];if(s.indexOf(pl)<0)continue;var repl=tgt[i%tgt.length];
    try{s=s.replace(new RegExp(pl+'(?![' +_trLet+ '])','g'),repl);}catch(e){s=s.split(pl).join(repl);}}
  return s;}
/* Marka-dışı tam yerelleştirme: şehir grameri + ilçe adları */
function localize(s,targetIl){return districts(city(s,targetIl),targetIl);}
window.TRG={lastVowel:lastVowel,back:back,round:round,I:I,A:A,endsVowel:endsVowel,hard:hard,suffix:suffix,city:city,districts:districts,localize:localize,hasIzmirPlace:hasIzmirPlace,IZMIR_PLACES:IZMIR_PLACES};
})();
