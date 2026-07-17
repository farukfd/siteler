/* ============================================================================
   dnShare — sosyal paylaşım + reklam altyapısı (ilan + özel portföy)
   Kullanım: dnShare({title, text, url, image, price, tag})
   - Facebook / WhatsApp / X / Telegram / LinkedIn paylaşım diyalogları (kullanıcı onaylar)
   - Bağlantıyı kopyala · Reklam/ilan metnini kopyala (FB Ads'e yapıştırılabilir) · Görsel indir
   - Mobilde native Web Share API ("Diğer") seçeneği
   Otomatik gönderim YOK; her paylaşım ilgili platformun kendi ekranında kullanıcı tarafından tamamlanır.
   ========================================================================== */
(function(){
  if(window.dnShare)return;
  function enc(s){return encodeURIComponent(s==null?'':s);}
  function abs(u){ if(!u)return location.href; if(/^https?:\/\//.test(u))return u; try{return new URL(u,location.href).href;}catch(e){return u;} }
  function esc(s){return (''+(s==null?'':s)).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function toast(m){ if(typeof window.toast==='function'){window.toast(m);return;} var t=document.createElement('div'); t.textContent=m; t.style.cssText='position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:#0e5e3e;color:#fff;padding:11px 18px;border-radius:10px;font:500 14px system-ui;z-index:2147483647;box-shadow:0 10px 30px rgba(0,0,0,.3)'; document.body.appendChild(t); setTimeout(function(){t.style.transition='opacity .4s';t.style.opacity='0';setTimeout(function(){t.remove();},400);},1900); }
  var IC={
    facebook:'<path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z"/>',
    whatsapp:'<path d="M.06 24l1.69-6.17A11.9 11.9 0 1 1 12 24a11.9 11.9 0 0 1-5.7-1.45L.06 24zM6.6 20.1l.37.22a9.9 9.9 0 1 0-3.35-3.29l.24.38-1 3.65 3.74-.96zM17.9 14.3c-.15-.25-.55-.4-1.15-.7s-1.36-.68-1.56-.76-.35-.12-.5.12-.57.7-.7.85-.26.16-.5.05a8.1 8.1 0 0 1-2.38-1.47 9 9 0 0 1-1.65-2.05c-.17-.3 0-.44.13-.58s.25-.29.37-.44.17-.25.26-.42.05-.31-.02-.44-.5-1.2-.68-1.65c-.18-.43-.36-.37-.5-.38h-.42a.8.8 0 0 0-.58.27 2.4 2.4 0 0 0-.76 1.8 4.2 4.2 0 0 0 .88 2.23c.11.14 1.52 2.32 3.68 3.25.51.22.92.36 1.23.46.52.16 1 .14 1.36.09.42-.06 1.36-.56 1.55-1.1s.19-1 .13-1.1z"/>',
    x:'<path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.15h7.6l5.24 6.93 6.06-6.93zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.4z"/>',
    telegram:'<path d="M22 2.2 2.4 9.8c-1.3.5-1.3 1.3-.2 1.6l5 1.56 1.92 5.9c.24.66.12.92.8.92.53 0 .76-.24 1.05-.53l2.5-2.43 5.2 3.84c.96.53 1.65.26 1.9-.9L23.4 3.9c.35-1.42-.55-2.07-1.4-1.7z"/>',
    linkedin:'<path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.27 20.1H3.65V9h3.62v11.1zM5.47 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zm14.63 12.7h-3.62v-5.6c0-1.35-.02-3.08-1.88-3.08-1.88 0-2.17 1.47-2.17 2.98v5.7H8.8V9h3.48v1.5h.05c.48-.9 1.66-1.88 3.42-1.88 3.66 0 4.34 2.4 4.34 5.55v5.93z"/>',
    link:'<path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    ad:'<path d="M3 11l18-8-4 18-4-7-3 3v-4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
    img:'<path d="M3 5h18v14H3z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="8.5" cy="9.5" r="1.7" fill="currentColor"/><path d="M21 16l-5-5-9 8" fill="none" stroke="currentColor" stroke-width="1.8"/>',
    more:'<circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>'
  };
  function svg(k,fill){return '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"'+(fill===false?'':' fill="currentColor"')+'>'+IC[k]+'</svg>';}
  function caption(item){
    var l=[];
    if(item.tag)l.push(item.tag.toLocaleUpperCase('tr'));
    l.push(item.title||'');
    var sub=[]; if(item.spec)sub.push(item.spec); if(item.price)sub.push(item.price); if(sub.length)l.push(sub.join(' · '));
    if(item.text)l.push(item.text);
    l.push(abs(item.url));
    if(item.brand)l.push('— '+item.brand);
    return l.filter(Boolean).join('\n');
  }
  function ensureCSS(){
    if(document.getElementById('dnShareCSS'))return;
    var s=document.createElement('style');s.id='dnShareCSS';
    s.textContent='.dnsh-back{position:fixed;inset:0;z-index:2147483000;background:rgba(8,20,14,.55);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .2s;font-family:system-ui,-apple-system,"IBM Plex Sans",sans-serif}'
    +'.dnsh-back.on{opacity:1}.dnsh{background:#fff;border-radius:16px;max-width:420px;width:100%;padding:22px;box-shadow:0 30px 70px rgba(0,0,0,.35);transform:translateY(12px);transition:transform .22s}'
    +'.dnsh-back.on .dnsh{transform:none}.dnsh h4{font-family:"Playfair Display",Georgia,serif;font-size:19px;color:#00452b;margin:0 0 3px}.dnsh p{font-size:12.5px;color:#707972;margin:0 0 16px}'
    +'.dnsh-x{position:absolute;top:14px;right:16px;background:none;border:none;font-size:20px;color:#707972;cursor:pointer}'
    +'.dnsh-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.dnsh-b{display:flex;flex-direction:column;align-items:center;gap:7px;padding:14px 6px;border:1px solid #e1e3e2;border-radius:12px;background:#fff;color:#00452b;font:600 12px inherit;cursor:pointer;text-decoration:none;transition:.18s}'
    +'.dnsh-b:hover{border-color:#0e5e3e;background:#f4faf6;transform:translateY(-2px)}.dnsh-b .ic{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;color:#fff}'
    +'.dnsh-b.fb .ic{background:#1877f2}.dnsh-b.wa .ic{background:#25d366}.dnsh-b.x .ic{background:#111}.dnsh-b.tg .ic{background:#2aabee}.dnsh-b.li .ic{background:#0a66c2}.dnsh-b.cp .ic{background:#0e5e3e}.dnsh-b.ad .ic{background:#c39b45}.dnsh-b.im .ic{background:#795901}.dnsh-b.mr .ic{background:#3f4942}'
    +'.dnsh-hero{display:flex;align-items:center;gap:13px;width:100%;margin:0 0 14px;padding:15px 17px;border:none;border-radius:13px;background:linear-gradient(135deg,#0e5e3e,#14805a);color:#fff;cursor:pointer;text-align:left;font-family:inherit;transition:.18s;box-shadow:0 8px 22px -8px rgba(14,94,62,.6)}'
    +'.dnsh-hero:hover{filter:brightness(1.06);transform:translateY(-1px)}.dnsh-hero>svg{width:26px;height:26px;flex:none;color:#fed175}.dnsh-hero b{display:block;font-weight:700;font-size:14.5px;line-height:1.2}.dnsh-hero small{display:block;font-size:11.5px;opacity:.88;margin-top:2px}'
    +'.dnsh-chk{display:flex;align-items:center;gap:9px;font-size:13px;color:#0f3d2e;margin:0 0 8px;font-weight:600}'
    +'.dnsh-chk span{width:22px;height:22px;border-radius:50%;display:grid;place-items:center;background:#eef1ef;color:#8a968e;font-size:12px;flex:none}.dnsh-chk span.ok{background:#0e5e3e;color:#fff}.dnsh-chk span.err{background:#b3341f;color:#fff}'
    +'.dnsh-ol{margin:15px 0 2px;padding-left:22px}.dnsh-ol li{font-size:12.9px;line-height:1.55;color:#404943;margin:0 0 9px}.dnsh-ol b{color:#0e5e3e}'
    +'.dnsh-note{font-size:11.5px;color:#8a968e;line-height:1.5;margin:6px 0 0}'
    +'.dnsh-gb{display:flex;gap:9px;margin-top:16px}.dnsh-mini{flex:1;padding:12px;border:1px solid #e1e3e2;border-radius:10px;background:#fff;color:#0e5e3e;font:600 12.5px inherit;cursor:pointer;transition:.16s}.dnsh-mini:hover{background:#f4faf6;border-color:#0e5e3e}.dnsh-mini.pri{background:linear-gradient(135deg,#0e5e3e,#14805a);color:#fff;border-color:transparent}'
    +'@media(max-width:420px){.dnsh-grid{grid-template-columns:repeat(3,1fr)}}';
    document.head.appendChild(s);
  }
  function copy(text,okMsg){
    try{ if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(function(){toast(okMsg||'Kopyalandı.');},function(){fallback();}); return; } }catch(e){}
    fallback();
    function fallback(){ try{var ta=document.createElement('textarea');ta.value=text;ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();toast(okMsg||'Kopyalandı.');}catch(e){toast('Kopyalanamadı — elle kopyalayın.');} }
  }
  function close(el){ el.classList.remove('on'); setTimeout(function(){el.remove();},240); }
  function slug(s){return (''+(s||'ilan')).toLowerCase().replace(/[çğıöşü]/g,function(c){return {'ç':'c','ğ':'g','ı':'i','ö':'o','ş':'s','ü':'u'}[c];}).replace(/[^\w]+/g,'-').replace(/^-+|-+$/g,'').slice(0,50)||'ilan';}
  function rrect(x,rx,ry,w,h,r){x.beginPath();x.moveTo(rx+r,ry);x.arcTo(rx+w,ry,rx+w,ry+h,r);x.arcTo(rx+w,ry+h,rx,ry+h,r);x.arcTo(rx,ry+h,rx,ry,r);x.arcTo(rx,ry,rx+w,ry,r);x.closePath();}
  function wrapLines(x,text,maxW,max){var w=(''+(text||'')).split(/\s+/),ls=[],cur='';for(var i=0;i<w.length;i++){var t=cur?cur+' '+w[i]:w[i];if(x.measureText(t).width>maxW&&cur){ls.push(cur);cur=w[i];}else cur=t;}if(cur)ls.push(cur);if(ls.length>max){ls=ls.slice(0,max);ls[max-1]=ls[max-1].replace(/\s*\S*$/,'')+'…';}return ls;}
  /* İLAN GÖRSELİ: kapak fotoğrafı + başlık/konum/özellik/fiyat/marka tek görselde (canvas) */
  /* dataURL → Blob (senkron, base64). NOT: canvas.toBlob() bazı Chromium sürümlerinde JPEG'de ~11sn sürüyor;
     toDataURL('image/jpeg') ~45ms → dataURL'i temel al, Blob'u buradan türet. */
  function dataURLtoBlob(du){try{var p=du.split(','),mime=((p[0].match(/:(.*?);/)||[])[1])||'image/jpeg',bin=atob(p[1]),n=bin.length,u8=new Uint8Array(n);while(n--)u8[n]=bin.charCodeAt(n);return new Blob([u8],{type:mime});}catch(e){return null;}}
  function composeShareImage(item){return new Promise(function(resolve,reject){
    var W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d');var photoH=Math.round(H*0.62);
    function finish(){try{var dataUrl=c.toDataURL('image/jpeg',.9);var blob=dataURLtoBlob(dataUrl);var f=null;try{if(blob)f=new File([blob],slug(item.title)+'.jpg',{type:'image/jpeg'});}catch(e){}resolve({blob:blob,dataUrl:dataUrl,file:f});}catch(e){reject();}}
    function render(img){
      x.fillStyle='#0e5e3e';x.fillRect(0,0,W,H);
      if(img){var iw=img.naturalWidth||img.width,ih=img.naturalHeight||img.height,s=Math.max(W/iw,photoH/ih),dw=iw*s,dh=ih*s;try{x.drawImage(img,(W-dw)/2,(photoH-dh)/2,dw,dh);}catch(e){}}
      var g=x.createLinearGradient(0,photoH*0.42,0,H);g.addColorStop(0,'rgba(8,48,31,0)');g.addColorStop(.5,'rgba(8,48,31,.72)');g.addColorStop(1,'#08301f');x.fillStyle=g;x.fillRect(0,0,W,H);
      var bt=((item.badge||item.tag)||'').toString().toLocaleUpperCase('tr');
      if(bt){x.font='700 34px "IBM Plex Sans",system-ui,sans-serif';var bw=x.measureText(bt).width+52;rrect(x,56,56,bw,64,12);x.fillStyle='#c39b45';x.fill();x.fillStyle='#0a3527';x.textBaseline='middle';x.textAlign='left';x.fillText(bt,82,56+33);}
      /* marka monogramı (sağ üst · emerald disk + altın harf) */
      var mono=(((item.brand||'M').replace(/[^A-Za-zÇĞİıÖŞÜçğöşü]/g,'')[0])||'M').toLocaleUpperCase('tr');
      var mR=44,mX=W-56-mR,mY=56+mR;
      x.beginPath();x.arc(mX,mY,mR,0,Math.PI*2);x.fillStyle='rgba(8,48,31,.5)';x.fill();x.lineWidth=2.5;x.strokeStyle='#c39b45';x.stroke();
      x.fillStyle='#e7d19a';x.font='700 42px "Playfair Display",Georgia,serif';x.textAlign='center';x.textBaseline='middle';x.fillText(mono,mX,mY+3);
      x.textBaseline='alphabetic';x.textAlign='left';
      var px=64,py=photoH+74;
      var loc=((item.loc||item.text)||'').toString().toLocaleUpperCase('tr');
      if(loc){x.fillStyle='#dcc389';x.font='600 30px "IBM Plex Sans",sans-serif';x.fillText(loc.slice(0,44),px,py);py+=24;x.fillStyle='#c39b45';rrect(x,px,py,68,4,2);x.fill();py+=46;}
      x.fillStyle='#fff';x.font='700 60px "Playfair Display",Georgia,serif';
      wrapLines(x,item.title||'',W-2*px,2).forEach(function(ln){x.fillText(ln,px,py);py+=70;});py+=10;
      if(item.spec){x.fillStyle='rgba(244,239,228,.92)';x.font='500 34px "IBM Plex Sans",sans-serif';x.fillText((''+item.spec).slice(0,54),px,py);py+=72;}
      if(item.price){x.fillStyle='#e7d19a';x.font='700 64px "Playfair Display",serif';var pw=x.measureText(''+item.price).width;x.fillText(''+item.price,px,py);x.fillStyle='rgba(195,155,69,.55)';rrect(x,px,py+16,Math.min(pw,360),4,2);x.fill();}
      /* alt marka şeridi + altın ayraç çizgisi */
      x.fillStyle='rgba(195,155,69,.28)';x.fillRect(px,H-96,W-2*px,1.5);
      x.fillStyle='rgba(220,195,137,.92)';x.font='600 29px "IBM Plex Sans",sans-serif';x.fillText((item.brand||'')+'   ·   EİDS Onaylı',px,H-50);
      finish();
    }
    if(item.image){var im=new Image();im.crossOrigin='anonymous';var done=false;im.onload=function(){if(done)return;done=true;render(im);};im.onerror=function(){if(done)return;done=true;render(null);};im.src=abs(item.image);setTimeout(function(){if(!done){done=true;render(im.complete&&im.naturalWidth?im:null);}},4500);}
    else render(null);
  });}
  function shareImage(item,cap,onDone){
    composeShareImage(item).then(function(r){
      if(r.file&&navigator.canShare&&navigator.canShare({files:[r.file]})){
        navigator.share({files:[r.file],text:cap,title:item.title||''}).then(function(){onDone&&onDone();},function(){}).catch(function(){});
      }else{
        var a=document.createElement('a');a.href=r.dataUrl;a.download=slug(item.title)+'.jpg';document.body.appendChild(a);a.click();a.remove();
        copy(cap,'📸 Kapak görseli (foto + özellikler) indirildi ve metin kopyalandı — Facebook/Instagram\'da yeni gönderi açıp görseli ekleyin, metni yapıştırın.');
        onDone&&onDone();
      }
    },function(){toast('Görsel hazırlanamadı.');});
  }
  window.dnShareCaption=caption; window.dnShareCompose=composeShareImage;
  /* Cihaz dosya paylaşımını (Web Share API L2) destekliyor mu? — senkron yetenek yoklaması */
  function canShareFiles(){try{return !!(navigator.canShare&&navigator.canShare({files:[new File([new Uint8Array([255,216,255])],'p.jpg',{type:'image/jpeg'})]}));}catch(e){return false;}}
  window.dnShareCanNative=canShareFiles;
  /* 2026 TEK DOKUNUŞ: cihaz destekliyorsa doğrudan native paylaşım (görsel+metin ekli — indirme/kopyalama YOK);
     desteklemiyorsa (çoğu masaüstü tarayıcı) yardımlı paylaşım sayfasına düşer. */
  window.dnShare=function(item){
    item=item||{};
    if(item.image && canShareFiles()){
      var capN=caption(item);
      try{toast('Görsel hazırlanıyor…');}catch(e){}
      composeShareImage(item).then(function(r){
        if(r&&r.file&&navigator.canShare&&navigator.canShare({files:[r.file]})){
          navigator.share({files:[r.file],text:capN,title:item.title||''}).then(function(){},function(err){ if(!err||err.name!=='AbortError')openSheet(item); }).catch(function(){});
        }else openSheet(item);
      },function(){ openSheet(item); });
      return;
    }
    openSheet(item);
  };
  function openSheet(item){
    item=item||{}; ensureCSS();
    var url=abs(item.url), cap=caption(item), t=item.title||item.tag||'Paylaş';
    var pop=[
      {k:'facebook',c:'fb',l:'Facebook',href:'https://www.facebook.com/sharer/sharer.php?u='+enc(url)},
      {k:'whatsapp',c:'wa',l:'WhatsApp',href:'https://wa.me/?text='+enc(cap)},
      {k:'x',c:'x',l:'X',href:'https://twitter.com/intent/tweet?text='+enc((item.title||'')+(item.price?' · '+item.price:''))+'&url='+enc(url)},
      {k:'telegram',c:'tg',l:'Telegram',href:'https://t.me/share/url?url='+enc(url)+'&text='+enc(cap)},
      {k:'linkedin',c:'li',l:'LinkedIn',href:'https://www.linkedin.com/sharing/share-offsite/?url='+enc(url)}
    ];
    var back=document.createElement('div');back.className='dnsh-back';
    var hero=item.image?('<button type="button" class="dnsh-hero" data-act="imgshare">'+svg('img',false)+'<span><b>Görsel + Bilgi ile Paylaş</b><small>Kapak fotoğrafı + tüm özellikler tek görselde (önerilen)</small></span></button>'):'';
    var btns=pop.map(function(p){
      return '<a class="dnsh-b '+p.c+'" href="'+p.href+'" target="_blank" rel="noopener noreferrer" data-close="1"><span class="ic">'+svg(p.k)+'</span>'+esc(p.l)+'</a>';
    }).join('');
    btns+='<button type="button" class="dnsh-b cp" data-act="link"><span class="ic">'+svg('link',false)+'</span>Bağlantı</button>';
    btns+='<button type="button" class="dnsh-b ad" data-act="ad"><span class="ic">'+svg('ad',false)+'</span>Reklam metni</button>';
    if(item.image)btns+='<button type="button" class="dnsh-b im" data-act="img"><span class="ic">'+svg('img',false)+'</span>Görseli indir</button>';
    if(navigator.share)btns+='<button type="button" class="dnsh-b mr" data-act="native"><span class="ic">'+svg('more')+'</span>Diğer</button>';
    back.innerHTML='<div class="dnsh" role="dialog" aria-modal="true" aria-label="Paylaş"><button class="dnsh-x" aria-label="Kapat">&times;</button>'
      +'<h4>Paylaş</h4><p>'+esc(t)+' — sosyal ağda paylaşınca <b>ilan kartı (kapak görseli + başlık + fiyat)</b> otomatik görünür. Mobilde “Görsel + Bilgi ile Paylaş” tek dokunuşla görseli de ekler.</p>'
      +hero+'<div class="dnsh-grid">'+btns+'</div></div>';
    document.body.appendChild(back);
    requestAnimationFrame(function(){back.classList.add('on');});
    back.addEventListener('click',function(e){
      if(e.target===back||e.target.classList.contains('dnsh-x')){close(back);return;}
      var b=e.target.closest('[data-act],[data-close]'); if(!b)return;
      if(b.getAttribute('data-close')){ setTimeout(function(){close(back);},60); return; }
      var act=b.getAttribute('data-act');
      if(act==='imgshare'){ shareImage(item,cap,function(){close(back);}); }
      else if(act==='link'){ copy(url,'Bağlantı kopyalandı.'); }
      else if(act==='ad'){ copy(cap,'Reklam metni kopyalandı — Facebook/Instagram reklamına yapıştırabilirsiniz.'); }
      else if(act==='img' && item.image){ composeShareImage(item).then(function(r){var a=document.createElement('a');a.href=r.dataUrl;a.download=slug(item.title)+'.jpg';document.body.appendChild(a);a.click();a.remove();toast('Kapak görseli (foto + özellik) indirildi.');},function(){toast('Görsel hazırlanamadı.');}); }
      else if(act==='native'){ try{navigator.share({title:item.title||'',text:cap,url:url}).catch(function(){});}catch(e){} close(back); }
    });
    document.addEventListener('keydown',function esc(e){if(e.key==='Escape'){close(back);document.removeEventListener('keydown',esc);}});
  };
})();
