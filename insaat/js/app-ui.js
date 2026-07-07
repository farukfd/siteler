/* insaat · app-ui.js — engine (P1 ayrıştırma; index.html'den) */
/* ========== .dwg mimari çözümleme (libredwg-web WASM) — tarayıcıda, hesapsız, backend'siz ========== */
(function(){
  function el(id){return document.getElementById(id);}
  function stat(m,k){var e=el('apsStatus');if(!e)return;e.textContent=m||'';e.style.color=k==='err'?'#ff6b6b':(k==='ok'?'#37d67a':'var(--muted)');}
  function show(s){var w=el('apsViewerWrap');if(w){w.style.display=s?'block':'none';if(s)try{w.scrollIntoView({behavior:'smooth',block:'center'});}catch(e){}}var b=el('apsBackBtn');if(b)b.style.display=s?'block':'none';}
  window.apsCloseViewer=function(){show(false);};
  /* ---- .dwg gömülü 2B önizleme (tamamen yerel, hesapsız) ---- */
  var DWG_VERS={AC1014:'AutoCAD R14',AC1015:'AutoCAD 2000',AC1018:'AutoCAD 2004',AC1021:'AutoCAD 2007',AC1024:'AutoCAD 2010',AC1027:'AutoCAD 2013',AC1032:'AutoCAD 2018'};
  function seq(u8,s,from){for(var i=from;i<u8.length-s.length;i++){var ok=true;for(var k=0;k<s.length;k++){if(u8[i+k]!==s[k]){ok=false;break;}}if(ok)return i;}return -1;}
  function u32(u8,o){return (u8[o]|u8[o+1]<<8|u8[o+2]<<16|u8[o+3]<<24)>>>0;}
  function u16(u8,o){return (u8[o]|u8[o+1]<<8)>>>0;}
  function extractImages(buf){
    var u8=new Uint8Array(buf),out=[],i,o;
    for(i=0;i<u8.length-24;i++){ // PNG — IHDR + makul boyut doğrula (sahte eşleşme yok)
      if(u8[i]===0x89&&u8[i+1]===0x50&&u8[i+2]===0x4E&&u8[i+3]===0x47&&u8[i+12]===0x49&&u8[i+13]===0x48&&u8[i+14]===0x44&&u8[i+15]===0x52){
        var w=(u8[i+16]<<24|u8[i+17]<<16|u8[i+18]<<8|u8[i+19])>>>0, h=(u8[i+20]<<24|u8[i+21]<<16|u8[i+22]<<8|u8[i+23])>>>0;
        if(w>=8&&w<=10000&&h>=8&&h<=10000){var j=seq(u8,[0x49,0x45,0x4E,0x44],i+16);if(j>0){var end=j+8;out.push({type:'image/png',w:w,h:h,bytes:u8.slice(i,end)});i=end-1;}}
      }
    }
    for(o=0;o<u8.length-40;o++){ // Başlıksız DIB (DWG önizleme) → geçerli BMP sentezle
      if(u32(u8,o)===40){
        var dw=u32(u8,o+4)|0, dhr=u32(u8,o+8)|0, planes=u16(u8,o+12), bit=u16(u8,o+14), comp=u32(u8,o+16);
        var dh=dhr<0?-dhr:dhr;
        if(planes===1&&(bit===1||bit===4||bit===8||bit===24||bit===32)&&comp<=3&&dw>=32&&dw<=10000&&dh>=32&&dh<=10000){
          var pal=(bit<=8)?(1<<bit)*4:0, row=Math.floor((bit*dw+31)/32)*4, imgsz=u32(u8,o+20)||row*dh, total=40+pal+imgsz;
          if(o+total<=u8.length){
            var fs=14+total, off=14+40+pal, bmp=new Uint8Array(fs);
            bmp[0]=0x42;bmp[1]=0x4D;bmp[2]=fs&255;bmp[3]=(fs>>8)&255;bmp[4]=(fs>>16)&255;bmp[5]=(fs>>24)&255;
            bmp[10]=off&255;bmp[11]=(off>>8)&255;bmp[12]=(off>>16)&255;bmp[13]=(off>>24)&255;
            bmp.set(u8.subarray(o,o+total),14);
            out.push({type:'image/bmp',w:dw,h:dh,bytes:bmp});o+=total-1;
          }
        }
      }
    }
    out.sort(function(a,c){return (c.w*c.h)-(a.w*a.h);});
    return {ver:String.fromCharCode(u8[0]||0,u8[1]||0,u8[2]||0,u8[3]||0,u8[4]||0,u8[5]||0),imgs:out.slice(0,6)};
  }
  window.dwgLocalPreview=function(file){
    window.__dwgFile=file; // gerçek vektör render için sakla
    var box=el('apsPreview');if(box)box.innerHTML='<span style="font-size:12px;color:var(--muted)">🔎 '+file.name+' okunuyor…</span>';
    var fr=new FileReader();
    fr.onload=function(){
      var r; try{r=extractImages(fr.result);}catch(e){if(box)box.innerHTML='<span style="font-size:12px;color:#ff6b6b">Okuma hatası.</span>';return;}
      var vName=DWG_VERS[r.ver]||r.ver||'?', mb=(file.size/1048576).toFixed(1);
      window.__dwgInfo={name:file.name,size:file.size,ver:vName,previews:[]};
      var head='<div style="font-size:12px;color:var(--muted);margin-bottom:6px">📄 <b>'+file.name+'</b> · '+vName+' · '+mb+' MB';
      var vbtn='<button class="btn-mini" style="width:100%;margin-top:8px;background:var(--accent);color:#0e0f13;border-color:var(--accent);font-weight:700" onclick="dwgAnalyze()">🏗️ Yapıyı Otomatik Çöz (2B plan + mahal + m²)</button>';
      if(!r.imgs.length){if(box)box.innerHTML=head+'<br>Gömülü önizleme yok — yine de gerçek vektör çizimini açabilirsiniz.</div>'+vbtn;return;}
      var html=head+' · '+r.imgs.length+' önizleme</div><div style="display:flex;flex-wrap:wrap;gap:8px">';
      r.imgs.forEach(function(im,idx){
        var blob=new Blob([im.bytes],{type:im.type});var url=URL.createObjectURL(blob);
        var d=new FileReader();d.onload=function(){
          window.__dwgInfo.previews.push(d.result);
          if(idx===0){ // birincil (en büyük) önizlemeyi fizibilite raporuna OTOMATİK ekle
            window.__p3images=window.__p3images||[];
            if(window.__p3images.indexOf(d.result)<0 && window.__p3images.length<4){
              window.__p3images.push(d.result);
              if(typeof window.renderReportImages==='function')window.renderReportImages();
              var nt=el('apsPrevNote');if(nt)nt.innerHTML='✓ Birincil önizleme <b>Fizibilite Raporu</b> görsellerine eklendi (📄 PDF\'te görünür).';
            }
          }
        };d.readAsDataURL(blob);
        html+='<img src="'+url+'" alt="önizleme '+im.w+'×'+im.h+'" title="'+im.w+'×'+im.h+' — büyütmek için tıklayın" style="width:132px;height:auto;border:1px solid var(--line);border-radius:8px;cursor:zoom-in;background:#fff" onclick="dwgZoom(this.src)">';
      });
      html+='</div><div id="apsPrevNote" style="font-size:11px;color:var(--muted);margin-top:6px">Gerçek çizim önizlemesi (DWG içinden). Rapora ekleniyor…</div>'+vbtn;
      if(box)box.innerHTML=html;
    };
    fr.onerror=function(){if(box)box.innerHTML='<span style="font-size:12px;color:#ff6b6b">Dosya okunamadı.</span>';};
    fr.readAsArrayBuffer(file);
  };
  window.dwgZoom=function(src){
    var o=document.createElement('div');o.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;cursor:zoom-out;padding:20px';
    o.onclick=function(){o.remove();};
    var img=new Image();img.src=src;img.style.cssText='max-width:96%;max-height:96%;background:#fff;border-radius:8px;image-rendering:pixelated;box-shadow:0 20px 60px rgba(0,0,0,.6)';
    o.appendChild(img);document.body.appendChild(o);
  };
  /* ---- Gerçek vektör çizim: libredwg-web (WASM) ile tarayıcıda DWG→SVG, hesapsız ---- */
  var _dwgLibP=null;
  function _loadLibreDwg(){
    if(_dwgLibP)return _dwgLibP;
    var base='https://cdn.jsdelivr.net/npm/@mlightcad/libredwg-web@0.7.7';
    _dwgLibP=import(base+'/dist/libredwg-web.js').then(function(m){
      return m.LibreDwg.create(base+'/wasm/').then(function(inst){return {LibreDwg:m.LibreDwg,DwgType:m.Dwg_File_Type,inst:inst};});
    });
    return _dwgLibP;
  }
  function _showSvg(svg){
    var wrap=el('apsViewerWrap'),host=el('apsViewer');if(!wrap||!host)return;
    var url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
    host.innerHTML='<div id="dwgSvgScroll" style="position:absolute;inset:0;overflow:auto;background:#0b0d12;text-align:center"><img id="dwgSvgImg" src="'+url+'" style="display:inline-block;width:1400px;height:auto;max-width:none;background:#fff;margin:8px"></div>'
      +'<div style="position:absolute;top:10px;right:10px;display:flex;gap:6px;z-index:5"><button class="btn-mini" style="width:36px" onclick="dwgSvgZoom(1.3)">＋</button><button class="btn-mini" style="width:36px" onclick="dwgSvgZoom(0.77)">－</button></div>';
    wrap.style.display='block';var b=el('apsBackBtn');if(b)b.style.display='block';
    try{wrap.scrollIntoView({behavior:'smooth',block:'center'});}catch(e){}
  }
  window.dwgSvgZoom=function(k){var img=el('dwgSvgImg');if(img){var w=parseFloat(img.style.width)||1400;img.style.width=Math.max(300,Math.min(30000,w*k))+'px';}};
  /* ===== DWG → GERÇEK YAPI ÇÖZÜMLEME (kat + mahal + m²), tamamen yerel ===== */
  function _clean(s){return (s||'').replace(/\\[A-Za-z][^;]*;|[{}\\]/g,'').replace(/\s+/g,' ').trim();}
  function _num2(s){var m=(String(s).match(/(\d{1,3}[.,]?\d{0,2})\s*(m2|m²)?/i)||[])[1];return m?(parseFloat(m.replace(',','.'))||0):0;}
  function _dwgExtractModel(db){
    var ents=db.entities||[], rawTexts=[];
    for(var i=0;i<ents.length;i++){var e=ents[i];if((e.type==='TEXT'||e.type==='MTEXT')&&e.text){var p=e.startPoint||e.insertionPoint;if(p&&isFinite(p.x))rawTexts.push({t:e.text,x:p.x,y:p.y,l:e.layer});}}
    var _lay=(db.tables&&db.tables.LAYER&&db.tables.LAYER.entries)?db.tables.LAYER.entries.length:0;
    return _dwgModelFromTexts(rawTexts,_lay,(db.header&&db.header.INSUNITS),ents.length);
  }
  function _dwgModelFromTexts(rawTexts,layers,insunits,entityCount){
    var toM=(insunits===6)?1:0.001;
    var texts=[];
    for(var i=0;i<rawTexts.length;i++){var _rc=_clean(rawTexts[i].t);if(_rc&&isFinite(rawTexts[i].x))texts.push({t:_rc,x:rawTexts[i].x,y:rawTexts[i].y});}
    var KAT=/(ZEMİN|BODRUM|ÇATI|\d+\.?\s*NORMAL|NORMAL)\s*KAT\b/i, NOISE=/ADEDİ|İRTİFAK|HOL|PLANI|ONAY|NOT|KAPAĞ|GİRİŞ/i;
    var floors=[],seen={};
    for(var j=0;j<texts.length;j++){var t=texts[j];if(KAT.test(t.t)&&!NOISE.test(t.t)){var k=t.t.toUpperCase();if(!seen[k]){seen[k]=1;floors.push(t);}}}
    var ROOMS=/^(SALON|MUTFAK\+SALON|MUTFAK|YATAK ODASI|ÇOCUK ODASI|EBEVEYN|ODA|BANYO|WC|HOL|ANTRE|BALKON|TERAS|OTURMA|YAŞAMA|KİLER|DEPO|GARAJ|DÜKKAN|DUKKAN|OFİS|VESTİYER|GİYİNME|ÇALIŞMA|YEMEK)/i;
    var nums=texts.filter(function(x){return /(^|:)\s*\d{1,3}[.,]?\d{0,2}\s*(m2|m²)/i.test(x.t)||/^\d{1,3}[.,]\d{1,2}$/.test(x.t);});
    var rooms=[];
    for(var r=0;r<texts.length;r++){var rt=texts[r];if(!ROOMS.test(rt.t))continue;
      var best=null,bd=1e18;for(var n=0;n<nums.length;n++){var d=Math.hypot(nums[n].x-rt.x,nums[n].y-rt.y);if(d<bd){bd=d;best=nums[n];}}
      var m2=(best&&bd*toM<5)?_num2(best.t):0; if(m2<1||m2>400)continue;
      rooms.push({name:rt.t,m2:m2,x:rt.x,y:rt.y});
    }
    // dedupe (aynı ad+m²+yakın konum)
    var uniq=[],ok;
    for(var a=0;a<rooms.length;a++){ok=true;for(var b=0;b<uniq.length;b++){if(uniq[b].name===rooms[a].name&&Math.abs(uniq[b].m2-rooms[a].m2)<0.1&&Math.hypot(uniq[b].x-rooms[a].x,uniq[b].y-rooms[a].y)*toM<1){ok=false;break;}}if(ok)uniq.push(rooms[a]);}
    rooms=uniq;
    rooms.sort(function(a,c){return c.m2-a.m2;});
    var byFloor={'Tüm Mahaller':rooms};
    var total=0;for(var z=0;z<rooms.length;z++)total+=rooms[z].m2;
    var katList=floors.map(function(x){return x.t;});
    var _ks=Math.max(katList.length,1);
    return {katSayisi:_ks,katlar:katList,mahalSayisi:rooms.length,toplamM2:Math.round(total*10)/10,avgFloorM2:Math.round((total/_ks)*10)/10,byFloor:byFloor,layers:layers||0,entityCount:entityCount||0};
  }
  function _renderAnalysis(model){
    var box=el('dwgAnalyz'); if(!box)return;
    var F={},fd=[]; try{F=_dwgFacts();window.__dwgFacts=F;}catch(e){} try{fd=_dwgFloorData();}catch(e){}
    var katN=(F.floorCount||fd.length||model.katSayisi||0);
    var totDaire=0,totDuk=0; fd.forEach(function(f){totDaire+=(f.apts&&f.apts.length)||0;totDuk+=(f.units&&f.units.length)||0;});
    function kpi(v,l){return '<span class="dwg-kpi"><b>'+v+'</b> '+l+'</span>';}
    var h='<div style="background:var(--surface);border:1px solid var(--accent);border-radius:14px;padding:16px;margin-top:4px">';
    h+='<h3 style="margin:0 0 10px;font-family:var(--head)">🏗️ Otomatik Yapı Analizi <span style="font-size:11px;color:var(--muted);font-weight:400">(DWG\'den — gerçek veri)</span></h3>';
    h+='<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">';
    h+=kpi(katN,'Kat');
    if(F.bbCount)h+=kpi(F.bbCount,'Bağımsız Bölüm');
    if(totDaire)h+=kpi(totDaire,'Daire');
    if(totDuk)h+=kpi(totDuk,'Dükkan');
    if(F.totalArea)h+=kpi(F.totalArea+' m²','Toplam inşaat');
    if(F.kullanim)h+=kpi(F.kullanim,'Kullanım');
    h+=kpi((model.entityCount||0).toLocaleString('tr-TR'),'nesne');
    h+='</div>';
    // BİRİNCİL: ProX ile Alan Cetvelinden GERÇEK veri okuma (uydurma yok)
    h+='<button id="dwgAiBtn" class="btn-mini" style="width:100%;margin:2px 0 12px;background:#16a34a;color:#fff;border:none;font-weight:800;font-size:13.5px;padding:13px;border-radius:11px;box-shadow:0 6px 18px rgba(22,163,74,.28);display:flex;align-items:center;justify-content:center;gap:8px" onclick="dwgProxAnalyze()">'+_prox(14)+'<span> ile Çözümle — Alan Cetvelinden gerçek veri</span></button>';
    // GRUPLU: her kat → DAİRE + DÜKKAN (düz mahal listesi DEĞİL)
    if(fd.length){
      h+='<div style="font-size:11.5px;color:var(--muted);margin:0 0 6px;text-transform:uppercase;letter-spacing:.04em">Kat · bağımsız bölüm (daire / dükkan)</div>';
      fd.forEach(function(f){
        var daire=f.apts||[], duk=f.units||[];
        var meta=[daire.length?daire.length+' daire':'',duk.length?duk.length+' dükkan':'',f.totalM2?f.totalM2+' m²':''].filter(Boolean).join(' · ');
        h+='<div style="margin-top:8px"><div style="font-weight:700;font-size:13px;color:var(--accent);margin:8px 0 4px">'+_esc(f.name)+(meta?' <span style="color:var(--muted);font-weight:400">· '+meta+'</span>':'')+'</div>';
        h+='<table class="dwg-tbl"><tbody>';
        daire.forEach(function(a){var od=(a.rooms||[]).map(function(r){return _esc(r.name);}).slice(0,8).join(', ');
          h+='<tr><td><b>'+(a.no?'Daire '+_esc(a.no):'Daire')+'</b> · '+_esc(a.tip)+(od?' <span style="color:var(--muted);font-size:11px">('+od+')</span>':'')+'</td><td style="text-align:right;font-weight:700">'+(a.net>0?(a.net+' m² net'):(a.m2+' m²'))+'</td></tr>';});
        duk.forEach(function(u){h+='<tr><td><b>'+_esc(u.name)+'</b> <span style="color:var(--muted);font-size:11px">ticari</span></td><td style="text-align:right;font-weight:700">'+u.m2+' m²</td></tr>';});
        if(!daire.length&&!duk.length&&f.rooms&&f.rooms.length){h+='<tr><td colspan="2" style="color:var(--muted);font-size:11px">'+f.rooms.slice(0,14).map(function(r){return _esc(r.name)+(r.m2?' <b>'+r.m2+'m²</b>':'');}).join(' · ')+'</td></tr>';}
        h+='</tbody></table></div>';
      });
      h+='<div style="font-size:11px;color:var(--muted);margin-top:8px">Daire tipleri oda düzeninden türetildi; kesin m²/fiyat için '+_PROX_INLINE+' ile Alan Cetvelini okuyun, sonra portföye ekleyin.</div>';
    } else {
      h+='<p style="font-size:12.5px;color:var(--muted);margin:0 0 8px">Bu çizimde kat/daire yapısı otomatik ayrışamadı. '+_PROX_INLINE+' düğmesiyle Alan Cetvelinden gerçek verileri okuyun; 2B plan tam görüntülenir.</p>';
    }
    h+='</div>';
    box.innerHTML=h;
  }
  var _DWG_CDN='https://cdn.jsdelivr.net/npm/@mlightcad/libredwg-web@0.7.7';
  var _DWG_WORKER_SRC="import { LibreDwg, Dwg_File_Type } from '"+_DWG_CDN+"/dist/libredwg-web.js';\nlet libP;\nself.onmessage=async function(e){try{if(!libP)libP=LibreDwg.create('"+_DWG_CDN+"/wasm/');var lib=await libP;var dwg=lib.dwg_read_data(e.data,Dwg_File_Type.DWG);var db=lib.convert(dwg);var svg=lib.dwg_to_svg(db);var ents=db.entities||[];var texts=[];var inserts=[];for(var i=0;i<ents.length;i++){var en=ents[i];if((en.type==='TEXT'||en.type==='MTEXT')&&en.text){var p=en.startPoint||en.insertionPoint;if(p&&typeof p.x==='number'&&isFinite(p.x))texts.push({t:en.text,x:p.x,y:p.y,l:en.layer});}else if(en.type==='INSERT'&&en.attribs&&en.attribs.length>=2&&inserts.length<4000){var ip=en.insertionPoint||{x:0,y:0};var aa=[];for(var ai=0;ai<en.attribs.length;ai++){var at=en.attribs[ai];if(at&&at.tag!=null)aa.push({g:String(at.tag),t:String(at.text==null?'':at.text)});}if(aa.length>=2)inserts.push({n:String(en.name||''),x:ip.x,y:ip.y,a:aa});}}var lys=(db.tables&&db.tables.LAYER&&db.tables.LAYER.entries)||[];var layerNames=[];for(var li=0;li<lys.length&&layerNames.length<80;li++){if(lys[li]&&lys[li].name)layerNames.push(String(lys[li].name));}var titles=[],frames=[];for(var qi=0;qi<ents.length;qi++){var qe=ents[qi];if((qe.type==='TEXT'||qe.type==='MTEXT')&&qe.text&&(/KAT\\s*PLAN|(?:BODRUM|ZEM[İI]N|NORMAL|[ÇC]ATI|ASMA|G[İI]R[İI][ŞS])\\s+KAT\\b/i.test(qe.text)&&!/HOL[ÜU]|ADED[İI]|[İI]RT[İI]FAK|KAR[ŞS]I|ONAY|SAH[İI]B|M[ÜU]LK|B[ÖO]L[ÜU]M|G[ÖO]R[ÜU]N|KES[İI]T|VAZ[İI]YET|APL[İI]KASYON|SINIR|NOT\\s*:/i.test(qe.text)&&qe.text.length<45)){var qp=qe.startPoint||qe.insertionPoint;if(qp&&typeof qp.x==='number'&&isFinite(qp.x))titles.push({t:qe.text,x:qp.x,y:qp.y});}else if((qe.type==='LWPOLYLINE'||qe.type==='POLYLINE')&&qe.vertices&&qe.vertices.length>=4&&frames.length<400){var ax0=1e18,ay0=1e18,ax1=-1e18,ay1=-1e18;for(var vj=0;vj<qe.vertices.length;vj++){var vv=qe.vertices[vj];if(!vv)continue;if(vv.x<ax0)ax0=vv.x;if(vv.x>ax1)ax1=vv.x;if(vv.y<ay0)ay0=vv.y;if(vv.y>ay1)ay1=vv.y;}var aw=ax1-ax0,ah=ay1-ay0;if(aw>1000&&aw<9000&&ah>2000&&ah<14000)frames.push({x0:ax0,y0:ay0,x1:ax1,y1:ay1,w:aw,h:ah});}}var insunits=db.header&&db.header.INSUNITS;try{lib.dwg_free(dwg);}catch(_){}self.postMessage({svg:svg,texts:texts,inserts:inserts,layers:lys.length,layerNames:layerNames,insunits:insunits,entityCount:ents.length,titles:titles,frames:frames});}catch(err){self.postMessage({error:String((err&&err.message)||err)});}};";
  function _dwgApplyResult(d){
    if(d.error){stat('Çözümleme hatası: '+d.error+' — dosya çok büyük/bozuk olabilir.','err');return;}
    if(d.svg&&d.svg.length>80)_showSvg(d.svg);
    window.__dwgSvg=(d.svg&&d.svg.length>80)?d.svg:'';
    window.__dwgRaw={texts:d.texts||[],layerNames:d.layerNames||[],layers:d.layers||0,insunits:d.insunits,entityCount:d.entityCount||0};
    window.__dwgInserts=d.inserts||[]; window.__dwgBBcache=null;
    window.__dwgTitles=d.titles||[]; window.__dwgFrames=d.frames||[]; window.__dwgFloorImgs=null;
    window.__dwgAi=null; var _ar=el('dwgAiResult');if(_ar)_ar.innerHTML=''; var _fp=el('dwgFloorPlans');if(_fp)_fp.innerHTML='';
    var model=d.model||_dwgModelFromTexts(d.texts||[],d.layers,d.insunits,d.entityCount);
    window.__dwgModel=model;
    _renderAnalysis(model);
    stat('✓ Çizim eksiksiz okundu: '+model.entityCount.toLocaleString('tr-TR')+' nesne. Kat planları görsele dönüştürülüyor…','ok');
    // Faz 1: gerçek kat planı görsellerini çıkar (çerçeve tespiti + viewBox crop, Y-flip)
    _dwgMakeFloorPlans().then(function(fp){window.__dwgFloorImgs=fp; _renderFloorPlans(fp);
      var _bbN=0; try{_bbN=_dwgBB().length;}catch(e){}
      stat('✓ Çizim okundu: '+model.entityCount.toLocaleString('tr-TR')+' nesne'+(fp&&fp.length?(' · '+fp.length+' kat planı görsele dönüştürüldü'):'')+(_bbN?(' · 🏷️ '+_bbN+' bağımsız bölüm KESİN net/brüt cetveli okundu'):'')+'. Şimdi ProX ile gerçek verileri okuyun.','ok');});
  }
  function _dwgMainThread(buf){
    _loadLibreDwg().then(function(lib){ setTimeout(function(){
      try{
        var dwg=lib.inst.dwg_read_data(buf,lib.DwgType.DWG);
        var db=lib.inst.convert(dwg);
        var svg=lib.inst.dwg_to_svg(db);
        var ents=db.entities||[], rawTexts=[], titles=[], frames=[], inserts=[];
        for(var i=0;i<ents.length;i++){var e=ents[i];
          if((e.type==='TEXT'||e.type==='MTEXT')&&e.text){var p=e.startPoint||e.insertionPoint;if(p&&isFinite(p.x)){rawTexts.push({t:e.text,x:p.x,y:p.y,l:e.layer});if(_isFloorTitle(_clean(e.text)))titles.push({t:e.text,x:p.x,y:p.y});}}
          else if(e.type==='INSERT'&&e.attribs&&e.attribs.length>=2&&inserts.length<4000){var ip=e.insertionPoint||{x:0,y:0};var aa=[];for(var ai=0;ai<e.attribs.length;ai++){var at=e.attribs[ai];if(at&&at.tag!=null)aa.push({g:String(at.tag),t:String(at.text==null?'':at.text)});}if(aa.length>=2)inserts.push({n:String(e.name||''),x:ip.x,y:ip.y,a:aa});}
          else if((e.type==='LWPOLYLINE'||e.type==='POLYLINE')&&e.vertices&&e.vertices.length>=4&&frames.length<400){var ax0=1e18,ay0=1e18,ax1=-1e18,ay1=-1e18;for(var vj=0;vj<e.vertices.length;vj++){var vv=e.vertices[vj];if(!vv)continue;if(vv.x<ax0)ax0=vv.x;if(vv.x>ax1)ax1=vv.x;if(vv.y<ay0)ay0=vv.y;if(vv.y>ay1)ay1=vv.y;}var aw=ax1-ax0,ah=ay1-ay0;if(aw>1000&&aw<9000&&ah>2000&&ah<14000)frames.push({x0:ax0,y0:ay0,x1:ax1,y1:ay1,w:aw,h:ah});}
        }
        var lys=(db.tables&&db.tables.LAYER&&db.tables.LAYER.entries)||[], layerNames=[];
        for(var li=0;li<lys.length&&layerNames.length<80;li++){if(lys[li]&&lys[li].name)layerNames.push(String(lys[li].name));}
        try{lib.inst.dwg_free(dwg);}catch(e){}
        _dwgApplyResult({svg:svg,texts:rawTexts,inserts:inserts,layers:lys.length,layerNames:layerNames,insunits:(db.header&&db.header.INSUNITS),entityCount:ents.length,titles:titles,frames:frames});
      }catch(e){stat('Çözümleme hatası: '+((e&&e.message)||e),'err');}
    },30); }).catch(function(e){stat('WASM yüklenemedi (internet/CDN?): '+((e&&e.message)||e),'err');});
  }
  window.dwgAnalyze=function(){
    var f=window.__dwgFile;if(!f){stat('Önce bir .dwg yükleyin.','err');return;}
    var mb=f.size/1048576;
    if(mb>3 && !confirm('Bu dosya '+mb.toFixed(1)+' MB — çözümleme 30-60 sn sürebilir. Devam?'))return;
    stat('WASM motoru yükleniyor + çizim çözümleniyor'+(mb>2?' (worker\'da — arayüz donmaz)':'')+'…');
    f.arrayBuffer().then(function(buf){
      var handled=false, worker=null;
      var fallback=function(){ if(handled)return; handled=true; if(worker)try{worker.terminate();}catch(e){} _dwgMainThread(buf); };
      try{
        worker=new Worker(URL.createObjectURL(new Blob([_DWG_WORKER_SRC],{type:'text/javascript'})),{type:'module'});
        worker.onmessage=function(ev){ if(handled)return; handled=true; try{worker.terminate();}catch(e){} _dwgApplyResult(ev.data); };
        worker.onerror=function(){ fallback(); };
        worker.postMessage(buf); // transfer YOK → fallback için buf korunur
        setTimeout(function(){ fallback(); }, mb>3?150000:60000); // takılırsa ana yola geç
      }catch(e){ fallback(); }
    }).catch(function(e){ stat('Dosya okunamadı: '+((e&&e.message)||e),'err'); });
  };
  /* ========== ProX — dosyanın Alan Cetvelindeki GERÇEK veriyi okur (sıfır uydurma) ========== */
  // GÜVENLİK: ProX/DeepSeek anahtarı İSTEMCİYE GÖMÜLMEZ (tarayıcıdan görülüp fatura üretilebilir).
  // Anahtar YALNIZCA çalışma-zamanında girilir: localStorage.setItem('deepseek_key','sk-...') VEYA
  // window.PROX_DS_KEY. Yayında: sunucu-taraflı proxy arkasına alın. Anahtar yoksa DWG-AI özelliği pasif kalır.
  var _DS_KEY_DEFAULT='';
  function _dsKey(){var k='';try{k=localStorage.getItem('deepseek_key')||'';}catch(e){}if(!k&&typeof window!=='undefined'&&window.PROX_DS_KEY)k=window.PROX_DS_KEY;return k||_DS_KEY_DEFAULT;}
  function _esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  // ProX marka rozeti (footer stiliyle: X yeşil kutuda)
  function _prox(sz){sz=sz||14;return '<span style="display:inline-flex;align-items:center;font-family:var(--head);font-weight:800;vertical-align:middle;font-size:'+sz+'px"><span style="color:var(--ink,#e8eefc)">Pro</span><span style="display:inline-flex;align-items:center;justify-content:center;min-width:1.35em;height:1.35em;background:#16a34a;color:#07130a;border-radius:5px;margin-left:2px">X</span></span>';}
  var _PROX_INLINE='Pro<span style="background:#16a34a;color:#07130a;border-radius:4px;padding:0 5px;font-weight:800">X</span>';
  // Güven/kaynak rozeti — her değerin nereden geldiğini gösterir (uydurma önleyici şeffaflık)
  function _srcTag(src){var m={labeled:['🏷️','çizimde yazılı','#2f7fe0'],measured:['📐','ölçüldü','#16a34a'],derived:['≈','türetildi','#d9930a'],unknown:['—','belirtilmemiş','#8892a0']}[src];if(!m)return '';return '<span title="'+m[1]+'" style="font-size:9px;background:'+m[2]+'22;color:'+m[2]+';border:1px solid '+m[2]+'55;border-radius:5px;padding:0 4px;margin-left:4px;vertical-align:middle;white-space:nowrap;font-weight:600">'+m[0]+' '+m[1]+'</span>';}
  function _deepseek(messages){
    var ctrl=(typeof AbortController!=='undefined')?new AbortController():null;
    var to=ctrl?setTimeout(function(){try{ctrl.abort();}catch(e){}},120000):0;
    var done=function(v){clearTimeout(to);return v;};
    return fetch('https://api.deepseek.com/chat/completions',{method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+_dsKey()},
      body:JSON.stringify({model:'deepseek-chat',temperature:0.1,max_tokens:8192,response_format:{type:'json_object'},messages:messages}),
      signal:ctrl?ctrl.signal:undefined
    }).then(function(r){if(!r.ok)return r.text().then(function(t){throw new Error('HTTP '+r.status+' — '+t.slice(0,140));});return r.json();})
      .then(function(j){return (j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content)||'';})
      .then(done,function(e){clearTimeout(to);throw (e&&e.name==='AbortError')?new Error('zaman aşımı (120 sn) — dosya çok karmaşık olabilir'):e;});
  }
  function _rname(r){return (r&&typeof r==='object')?(r.name||''):String(r||'');}
  function _rm2(r){return (r&&typeof r==='object'&&r.m2)?r.m2:0;}
  // Kesik/eksik JSON onarımı — yalnız TAM kapanan öğelere kadar geri alır, sonra parantezleri kapatır
  function _dsParse(txt){
    if(!txt)return null;
    var s=String(txt).replace(/^```(?:json)?/i,'').replace(/```\s*$/,'').trim();
    var a=s.indexOf('{'); if(a<0)return null; s=s.slice(a);
    try{return JSON.parse(s);}catch(e){}
    var inStr=false,esc=false,stack=[],safeCut=-1,safeStack=null;
    for(var i=0;i<s.length;i++){var ch=s[i];
      if(inStr){ if(esc)esc=false; else if(ch==='\\')esc=true; else if(ch==='"')inStr=false; continue; }
      if(ch==='"')inStr=true;
      else if(ch==='{'||ch==='[')stack.push(ch==='{'?'}':']');
      else if(ch==='}'||ch===']'){stack.pop();safeCut=i;safeStack=stack.slice();}
    }
    if(safeCut<0)return null;
    var cand=s.slice(0,safeCut+1).replace(/,\s*$/,''), closers=(safeStack||[]).slice().reverse().join('');
    try{return JSON.parse(cand+closers);}catch(e){return null;}
  }
  /* ===== ANTET (PAFTA) + KESİT OKUYUCU — dosyanın resmi proje künyesinden GERÇEK veri ===== */
  // Bağımsız bölüm sayısı, kat adedi, toplam alan, kullanım amacı, yapı sınıfı, ilçe — antet + bağımsız bölüm numaralarından (çapraz doğrulama).
  // KAT BAŞLIĞI — "PLANI" ZORUNLU DEĞİL: "BODRUM KAT", "1 NORMAL KAT", "ZEMİN KAT PLANI" hepsini yakalar
  var _FLOORTITLE=/KAT\s*PLAN|(?:BODRUM|ZEM[İI]N|NORMAL|[ÇC]ATI|ASMA|G[İI]R[İI][ŞS])\s+KAT\b/i;
  var _FLOOREX=/HOL[ÜU]|ADED[İI]|[İI]RT[İI]FAK|KAR[ŞS]I|ONAY|SAH[İI]B|M[ÜU]LK|SO[ŞS]E|B[ÖO]L[ÜU]M|G[ÖO]R[ÜU]N|KES[İI]T|VAZ[İI]YET|APL[İI]KASYON|SINIR|NOT\s*:/i;
  function _isFloorTitle(t){return _FLOORTITLE.test(t)&&!_FLOOREX.test(t)&&String(t).length<45;}
  function _dwgAntet(raw){
    var ms=[]; for(var i=0;i<raw.length;i++){var c=_clean(raw[i].t);if(c&&isFinite(raw[i].x))ms.push({t:c,x:raw[i].x,y:raw[i].y});}
    // antet sütun genişliği: "KAT ADEDİ" ↔ "B.BÖLÜM SAYISI" etiketleri arası (yoksa 250)
    var lblKat=null,lblBB=null;for(var q=0;q<ms.length;q++){if(!lblKat&&/KAT\s*ADED[İI]/i.test(ms[q].t))lblKat=ms[q];if(!lblBB&&/B[ÖO]L[ÜU]M\s*SAYISI/i.test(ms[q].t))lblBB=ms[q];}
    var colW=(lblKat&&lblBB)?Math.max(60,Math.abs(lblBB.x-lblKat.x)*0.9):250, rowH=colW*0.6;
    // DEĞER ETİKETİN TAM ALTINDA (aynı sütun): dy<0, |dx|<colW, ≤2.5 satır aşağı. Yoksa sağ komşu.
    function nearBelow(labelRe,test,cw,rh){
      var lbl=null;for(var i=0;i<ms.length;i++){if(labelRe.test(ms[i].t)){lbl=ms[i];break;}}
      if(!lbl)return null;
      var best=null,bs=1e18;
      for(var j=0;j<ms.length;j++){var t=ms[j];if(t===lbl||!test(t.t))continue;var dx=t.x-lbl.x,dy=t.y-lbl.y;
        if(dy>-rh*0.2||dy<-rh*2.5||Math.abs(dx)>cw)continue; var sc=Math.abs(dx)*3+(-dy); if(sc<bs){bs=sc;best=t.t;}}
      if(best!=null)return best;
      for(var j2=0;j2<ms.length;j2++){var t2=ms[j2];if(t2===lbl||!test(t2.t))continue;var dx2=t2.x-lbl.x,dy2=t2.y-lbl.y;
        if(dx2<cw*0.2||dx2>cw*3||Math.abs(dy2)>rh*0.7)continue;var s2=dx2+Math.abs(dy2)*3;if(s2<bs){bs=s2;best=t2.t;}}
      return best;
    }
    var katAdedi=nearBelow(/KAT\s*ADED[İI]/i,function(t){return /^\d{1,2}$/.test(t)&&+t>=1&&+t<=40;},colW,rowH);
    var bbLbl=nearBelow(/B[ÖO]L[ÜU]M\s*SAYISI/i,function(t){return /^\d{1,3}$/.test(t)&&+t>=1&&+t<=400;},colW,rowH);
    var kullanim=nearBelow(/KULLANIM\s*AMACI/i,function(t){return /KONUT|T[İI]CAR|MESKEN|B[ÜU]RO|OF[İI]S/i.test(t)&&t.length<24;},colW*1.4,rowH);
    var yapiSinif=nearBelow(/YAPI\s*SINIFI/i,function(t){return /^\d\s*\/\s*[A-E]$|^\d[A-E]$|^[A-E]\/\d$/.test(t.replace(/\s/g,''));},colW,rowH);
    var ilce=nearBelow(/[İI]L[ÇC]ES[İI]/i,function(t){return /^[A-ZÇĞİÖŞÜ][A-Za-zÇĞİÖŞÜçğıöşü]{3,18}$/.test(t)&&!/[İI]L[ÇC]E|MAHALLE|PAFTA|PARSEL|BLOK|ARSA|SOKAK|CADDE/i.test(t);},colW*1.3,rowH);
    var toplam=nearBelow(/TOPLAM\s*[İI]N[ŞS]AAT/i,function(t){return /\d{2,6}[.,]\d{1,2}\s*m/i.test(t);},colW*1.8,rowH);
    // toplam fallback: antet bölgesindeki (kat başlıklarının solu) en büyük ondalık m²
    var titles=ms.filter(function(t){return _isFloorTitle(t.t);}).sort(function(a,b){return a.x-b.x;});
    var toplamV=toplam?parseFloat((toplam.match(/(\d{2,6}[.,]\d{1,2})/)||[0,'0'])[1].replace(',','.')):0;
    if(!toplamV&&titles.length){var leftX=titles[0].x-2000,best2=0;for(var a2=0;a2<ms.length;a2++){if(ms[a2].x>leftX)continue;var m=ms[a2].t.match(/(\d{3,6}[.,]\d{1,2})\s*m/i);if(m){var v=parseFloat(m[1].replace(',','.'));if(v>100&&v<99999&&v>best2)best2=v;}}toplamV=best2;}
    // bağımsız bölüm sayısı: ANTET değeri OTORİTER (numara dizisi kot/rakımla kirlenebilir) → fallback maxSeq
    var nums={};for(var k=0;k<ms.length;k++){if(/^\d{1,2}$/.test(ms[k].t)){var n=parseInt(ms[k].t,10);if(n>=1&&n<=99)nums[n]=1;}}
    var maxSeq=0;for(var s=1;s<=99;s++){if(nums[s])maxSeq=s;else if(s>1&&!nums[s]&&!nums[s+1])break;}
    return {
      bbSayisi:(bbLbl?parseInt(bbLbl):(maxSeq>=2?maxSeq:null)),
      bbAntet:(bbLbl?parseInt(bbLbl):null), bbNumMax:maxSeq||null,
      katAdedi:(katAdedi?parseInt(katAdedi):null),
      toplamAlan:(toplamV||null),
      kullanim:_kullanimLbl(kullanim), yapiSinifi:(yapiSinif||'').replace(/\s/g,'')||null, ilce:ilce||null
    };
  }
  function _kullanimLbl(k){if(!k)return null;k=String(k).toUpperCase();if(/KONUT.*T[İI]C|T[İI]C.*KONUT/.test(k))return 'Konut + Ticari';if(/KONUT|MESKEN/.test(k))return 'Konut';if(/T[İI]CAR/.test(k))return 'Ticari';if(/B[ÜU]RO|OF[İI]S/.test(k))return 'Ofis';return null;}
  /* GERÇEK VERİ ÇIKARIMI — deterministik, dosyanın Alan Cetvelinden; hiçbir şey uydurulmaz. */
  function _dwgFacts(){
    var raw=window.__dwgRaw||{}, toM=(raw.insunits===6)?1:0.001, T=[], arr=raw.texts||[];
    for(var i=0;i<arr.length;i++){var c=_clean(arr[i].t); if(c&&isFinite(arr[i].x))T.push({t:c,x:arr[i].x*toM,y:arr[i].y*toM});}
    function nearestVal(labelRe,valRe,max){var best=null,bd=1e18;for(var a=0;a<T.length;a++){if(!labelRe.test(T[a].t))continue;for(var o=0;o<T.length;o++){if(o===a||!valRe.test(T[o].t))continue;var d=Math.hypot(T[a].x-T[o].x,T[a].y-T[o].y);if(d<bd&&d<(max||3)){bd=d;best=T[o].t;}}}return best;}
    function dedupCount(re){var s={},n=0;for(var i2=0;i2<T.length;i2++){if(!re.test(T[i2].t))continue;var k=Math.round(T[i2].x)+','+Math.round(T[i2].y);if(!s[k]){s[k]=1;n++;}}return n;}
    // KATLAR — "... KAT PLANI" başlıklarından (gerçek)
    var fset=[];
    function floorName(s){var u=s.toUpperCase();if(/BODRUM/.test(u))return 'Bodrum Kat';if(/ZEM/.test(u))return 'Zemin Kat';if(/ÇATI|CATI/.test(u))return 'Çatı Katı';var m=u.match(/(\d+)\.?\s*NORMAL/);if(m)return m[1]+'. Normal Kat';if(/G[İI]R[İI][ŞS]/.test(u))return 'Giriş Kat';return '';}
    for(var j=0;j<T.length;j++){if(!_isFloorTitle(T[j].t))continue;var nm=floorName(T[j].t);if(nm&&fset.indexOf(nm)<0)fset.push(nm);}
    function forder(n){var u=n.toUpperCase();if(/BODRUM/.test(u))return -1;if(/ZEM/.test(u))return 0;if(/ÇATI|CATI/.test(u))return 98;var m=u.match(/(\d+)/);return m?parseInt(m[1]):50;}
    fset.sort(function(a,b){return forder(a)-forder(b);});
    // BAĞIMSIZ BÖLÜM SAYISI (gerçek) — etiketin komşu hücresindeki sayı, yoksa distinct BB numarası
    var bbStr=nearestVal(/B\.?\s*B[ÖO]L[ÜU]M\s*SAYISI|BA[ĞG]IMSIZ\s*B[ÖO]L[ÜU]M\s*SAYISI/i,/^\d{1,3}$/,2.5);
    var bbCount=bbStr?parseInt(bbStr):null;
    if(!bbCount){var st={};for(var b2=0;b2<T.length;b2++){var mm=T[b2].t.match(/(\d+)\s*NO'?LU/i);if(mm&&/BA[ĞG]IMSIZ|daire|d[üu]kkan/i.test(T[b2].t))st[mm[1]]=1;}var kk2=Object.keys(st);bbCount=kk2.length||null;}
    // TOPLAM İNŞAAT ALANI (gerçek)
    var taStr=nearestVal(/TOPLAM\s*İ?NŞAAT\s*ALAN|TOPLAM\s*I?NSAAT\s*ALAN/i,/\d{2,5}[.,]\d{1,2}\s*m[2²]/i,2.5);
    var totalArea=taStr?parseFloat((taStr.match(/(\d{2,5}[.,]\d{1,2})/)||[0,'0'])[1].replace(',','.')):null;
    // DAİRE / DÜKKAN (ait-alan satırları, konum-dedup) — yaklaşık
    var daireN=dedupCount(/nolu\s*daire/i), dukkanN=dedupCount(/nolu\s*d[üu]kkan/i);
    if(!daireN&&!dukkanN){dukkanN=dedupCount(/^d[üu]kkan\b/i);}
    // GERÇEK m² değerleri (dosyadan)
    var m2=[]; for(var q=0;q<T.length;q++){var m3=T[q].t.match(/(\d{1,4}[.,]\d{1,2})\s*m[2²]/i);if(m3){var v=parseFloat(m3[1].replace(',','.'));if(v>2&&v<5000)m2.push(v);}}
    // Teknik hacimler (birim DEĞİL) — sadece bilgi
    var tech=dedupCount(/(kazan|makin[ae]|trafo|jenerat[öo]r|pompa)\s*daire|sığınak|siginak|su\s*deposu|hidrofor/i);
    // ANTET (resmi pafta künyesi) — en OTORİTER kaynak: b.bölüm sayısı + toplam alan + kullanım + yapı sınıfı + ilçe
    var ant={}; try{ant=_dwgAntet(arr);}catch(e){}
    // BAĞIMSIZ BÖLÜM SAYISI: antet/numara (çapraz-doğrulanmış) > segmentasyon > etiket
    var segN=0,segDaire=0,segDuk=0; try{_dwgFloorData().forEach(function(d){var na=(d.apts&&d.apts.length)||0,nu=(d.units&&d.units.length)||0;segDaire+=na;segDuk+=nu;segN+=na+nu;});}catch(e){}
    if(ant.bbSayisi)bbCount=ant.bbSayisi; else if(segN)bbCount=segN;
    if(segDaire)daireN=segDaire; if(segDuk)dukkanN=segDuk; // gerçek segmentasyon sayımı (etiket over-count'unu yener)
    if(ant.toplamAlan)totalArea=ant.toplamAlan; // antetteki resmi toplam inşaat alanı (kat-türetiminden güvenilir)
    return {floors:fset, floorCount:fset.length, katAdedi:ant.katAdedi||null, bbCount:bbCount, bbAntet:ant.bbAntet||null, bbNumMax:ant.bbNumMax||null, totalArea:totalArea, kullanim:ant.kullanim||null, yapiSinifi:ant.yapiSinifi||null, ilceAntet:ant.ilce||null, daireN:daireN, dukkanN:dukkanN, tech:tech, m2:m2, layerNames:(raw.layerNames||[]).slice(0,40), entityCount:raw.entityCount||0, layers:raw.layers||0, fileName:(window.__dwgInfo&&window.__dwgInfo.name)||''};
  }
  function _valStr(s){s=String(s==null?'':s).trim();return (s&&!/uydur|bilinm|belirsiz|null/i.test(s))?s:'';}
  function _autoType(F){if(F&&F.kullanim)return F.kullanim;var hasDuk=(F.dukkanN||0)>0||/DÜKKAN|DUKKAN|MAĞAZA|TİCAR/i.test((F.layerNames||[]).join(' '));var hasDaire=(F.daireN||0)>0||(F.bbCount||0)>0;if(hasDuk&&hasDaire)return 'Konut + Ticari';if(hasDuk)return 'Ticari';if(hasDaire)return 'Konut';return 'Yapı';}
  // ProX metnindeki, gerçeklerde OLMAYAN m² iddialarını maskele (uydurma sızıntısını engelle)
  function _sanitize(s,F){s=String(s==null?'':s);if(!s)return '';var ta=F.totalArea?String(Math.round(F.totalArea)):null;
    return s.replace(/(\d[\d.,]*)\s*(m²|m2)/gi,function(full,num){var r=String(Math.round(parseFloat(String(num).replace(/\./g,'').replace(',','.'))||0));if(ta&&(r===ta||String(num).indexOf(ta)>=0))return full;return 'ilgili alan';});}
  window.dwgProxAnalyze=function(){
    if(!window.__dwgRaw){stat('Önce "Yapıyı Otomatik Çöz" ile çizimi okuyun.','err');return;}
    var F=_dwgFacts(); window.__dwgFacts=F;
    if(!F.floorCount&&!F.bbCount&&!F.totalArea&&!F.m2.length){stat('Bu çizimde okunacak Alan Cetveli/kat/m² verisi bulunamadı. 2B plan yine de tam görüntülenir; detayları admin girer.','err');return;}
    var btn=el('dwgAiBtn'); if(btn){btn.disabled=true;btn.style.opacity='.7';btn.innerHTML=_prox(13)+' okuyor…';}
    stat('✓ Gerçek veriler okundu: '+F.floorCount+' kat'+(F.bbCount?' · '+F.bbCount+' bağımsız bölüm':'')+(F.totalArea?' · '+F.totalArea+' m²':'')+'. ProX profesyonel özet yazıyor…');
    _renderProx(F,{buildingTypeLabel:_autoType(F),summary:'',highlights:[]}); // GERÇEK veriyi ANINDA göster; ProX prose sonra güncellenir
    var facts={dosya:F.fileName, katSayisi:F.floorCount, katlar:F.floors, bagimsizBolumSayisi:F.bbCount, toplamInsaatAlaniM2:F.totalArea, daireSayisiTahmini:F.daireN||null, dukkanSayisiTahmini:F.dukkanN||null, teknikHacim:F.tech, gercekM2Adedi:F.m2.length, enBuyukM2:F.m2.length?Math.max.apply(null,F.m2):null, katmanlar:F.layerNames};
    var sys='Sen bir mimari sunum editörüsün. Sana bir DWG projesinden DETERMİNİSTİK olarak çıkarılmış GERÇEK VERİLER (JSON) veriliyor. Görevin SADECE bu verilerden akıcı, profesyonel Türkçe bir yapı tanıtımı üretmek.\n\nKESİN KURALLAR (ihlal = ret):\n1) Verilmeyen HİÇBİR sayı/m²/birim/kat/tip UYDURMA. Yalnız verilen alanlardaki değerleri kullanabilirsin.\n2) Daire tipi (2+1, dubleks vb.) VERİLMEDİ → asla tahmin etme, yazma.\n3) summary yalnız verilen gerçeklere dayanır; başka rakam üretme.\n4) buildingTypeLabel: verilere göre kısa etiket (ör. "Konut + Ticari", "Konut", "Kamu Yapısı"). Emin değilsen "Yapı".\n\nSADECE şu JSON (başka metin yok): {"buildingTypeLabel":"kısa etiket","summary":"2-3 cümle, yalnız verilen gerçeklerle","highlights":["kısa madde","kısa madde"]}';
    var usr='GERÇEK VERİLER (yalnızca bunları kullan):\n'+JSON.stringify(facts);
    _deepseek([{role:'system',content:sys},{role:'user',content:usr}]).then(function(txt){
      var ai=_dsParse(txt)||{};
      window.__dwgProx={buildingTypeLabel:_valStr(ai.buildingTypeLabel)||_autoType(F), summary:_sanitize(ai.summary,F), highlights:(ai.highlights||[]).map(function(x){return _sanitize(x,F);}).filter(Boolean).slice(0,6)};
      _renderProx(F,window.__dwgProx);
      stat('✓ ProX gerçek verileri okudu: '+F.floorCount+' kat'+(F.bbCount?' · '+F.bbCount+' bağımsız bölüm':'')+(F.totalArea?' · '+F.totalArea+' m²':'')+'. Yazılı olmayan (tip/fiyat) admin panelde tamamlanır.','ok');
    }).catch(function(e){
      window.__dwgProx={buildingTypeLabel:_autoType(F),summary:'',highlights:[]};
      _renderProx(F,window.__dwgProx);
      stat('ProX metni üretilemedi ('+((e&&e.message)||e)+') — ama gerçek veriler okundu ve aşağıda gösterildi.','ok');
    }).then(function(){var b=el('dwgAiBtn');if(b){b.disabled=false;b.style.opacity='1';b.innerHTML=_prox(13)+' ile yeniden oku';}});
  };
  window.dwgAiAnalyze=window.dwgProxAnalyze; // eski buton çağrısı uyumluluğu
  function _renderProx(F,prox){
    var box=el('dwgAiResult'); if(!box)return;
    var h='<div style="background:var(--surface);border:2px solid #16a34a;border-radius:16px;padding:18px;margin-top:14px">';
    h+='<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px"><h3 style="margin:0;font-family:var(--head)">Yapı Çözümlemesi</h3><span style="margin-left:auto">'+_prox(14)+'</span></div>';
    h+='<div style="font-size:11px;color:var(--muted);margin:-2px 0 12px">Aşağıdaki değerler doğrudan mimari dosyanın <b>Alan Cetvelinden</b> okunmuştur — hiçbir değer uydurulmamıştır.</div>';
    if(prox.buildingTypeLabel)h+='<div style="font-size:12.5px;color:var(--muted);margin-bottom:8px">🏢 <b style="color:var(--ink)">'+_esc(prox.buildingTypeLabel)+'</b></div>';
    if(prox.summary)h+='<p style="font-size:13px;line-height:1.6;margin:0 0 12px">'+_esc(prox.summary)+'</p>';
    // GERÇEK KPI (deterministik) + kaynak rozetleri
    h+='<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px">';
    if(F.floorCount)h+='<span class="dwg-kpi"><b>'+F.floorCount+'</b> Kat'+_srcTag('labeled')+'</span>';
    if(F.bbCount)h+='<span class="dwg-kpi"><b>'+F.bbCount+'</b> Bağımsız Bölüm'+_srcTag('labeled')+'</span>';
    if(F.totalArea)h+='<span class="dwg-kpi"><b>'+F.totalArea+'</b> m² toplam inşaat'+_srcTag('labeled')+'</span>';
    if(F.kullanim)h+='<span class="dwg-kpi"><b>'+_esc(F.kullanim)+'</b> kullanım'+_srcTag('labeled')+'</span>';
    if(F.yapiSinifi)h+='<span class="dwg-kpi"><b>'+_esc(F.yapiSinifi)+'</b> yapı sınıfı'+_srcTag('labeled')+'</span>';
    if(F.katAdedi)h+='<span class="dwg-kpi" style="opacity:.85"><b>'+F.katAdedi+'</b> kat adedi (resmi)'+_srcTag('labeled')+'</span>';
    if(F.daireN)h+='<span class="dwg-kpi"><b>'+F.daireN+'</b> Daire'+_srcTag('derived')+'</span>';
    if(F.dukkanN)h+='<span class="dwg-kpi"><b>'+F.dukkanN+'</b> Dükkan'+_srcTag('derived')+'</span>';
    if(F.tech)h+='<span class="dwg-kpi" style="opacity:.7"><b>'+F.tech+'</b> teknik hacim'+_srcTag('labeled')+'</span>';
    h+='</div>';
    h+='<div style="font-size:10.5px;color:var(--muted);margin-bottom:12px">Rozetler: 🏷️ çizimde yazılı · 📐 geometriden ölçüldü · ≈ türetildi (yaklaşık) · — belirtilmemiş (admin girer). <b>Hiçbir değer uydurulmaz.</b></div>';
    if(F.floors&&F.floors.length)h+='<div style="font-size:12.5px;margin-bottom:12px">🏢 <b>Katlar:</b> '+F.floors.map(function(k){return '<span style="background:var(--surface-2,rgba(120,120,140,.09));border:1px solid var(--line);border-radius:6px;padding:2px 9px;margin:2px 3px 0 0;display:inline-block">'+_esc(k)+'</span>';}).join('')+'</div>';
    if(F.m2&&F.m2.length){var sorted=F.m2.slice().sort(function(a,b){return b-a;});h+='<details style="margin-bottom:12px"><summary style="cursor:pointer;font-size:12.5px;color:#16a34a;font-weight:700">📋 Gerçek m² cetveli — '+F.m2.length+' değer (dosyadan)</summary><div style="font-size:11px;color:var(--muted);margin-top:8px;line-height:1.8;max-height:130px;overflow:auto">'+sorted.slice(0,80).map(function(v){return v+' m²';}).join(' · ')+(sorted.length>80?' …':'')+'</div></details>';}
    if(prox.highlights&&prox.highlights.length)h+='<ul style="font-size:12.5px;color:var(--muted);margin:0 0 12px;padding-left:18px;line-height:1.6">'+prox.highlights.map(function(x){return '<li>'+_esc(x)+'</li>';}).join('')+'</ul>';
    h+='<div style="font-size:11.5px;color:var(--muted);background:var(--surface-2,rgba(120,120,140,.06));border:1px dashed var(--line);border-radius:9px;padding:9px 11px;margin-bottom:12px;line-height:1.55">ℹ️ Daire tipleri (2+1, dubleks vb.) ve birim fiyatları mimari dosyada <b>yazılı olmadığından</b> "belirtilmemiş" bırakıldı. Portföye ekledikten sonra <b>admin → Projeler</b> bölümünde her birimin tipini/fiyatını tek tıkla tamamlayabilirsiniz.</div>';
    h+='<button class="btn-mini" style="width:100%;background:#16a34a;color:#fff;border-color:#16a34a;font-weight:800;font-size:13px;padding:12px" onclick="dwgToPortfolio()">✅ Bu Projeyi Portföye Ekle (gerçek veriler)</button>';
    h+='</div>';
    box.innerHTML=h;
    try{box.scrollIntoView({behavior:'smooth',block:'nearest'});}catch(e){}
  }
  window.dwgToPortfolio=function(){
    if(typeof PROJECTS==='undefined'){stat('Proje sistemi hazır değil.','err');return;}
    var g=function(id){return (el(id)||{}).value||'';};
    var _Fpre=window.__dwgFacts||{};
    var il=g('dwg_il')||'İstanbul', ilce=g('dwg_ilce')||_Fpre.ilceAntet||'', mah=g('dwg_mah'), ada=g('dwg_ada'), parsel=g('dwg_parsel');
    var loc=[mah,ilce,il].filter(Boolean).join(', ')||il;
    var title=g('dwg_ad')||((window.__dwgInfo&&window.__dwgInfo.name)?window.__dwgInfo.name.replace(/\.dwg$/i,''):'DWG Projesi');
    var thumb=(window.__dwgInfo&&window.__dwgInfo.previews&&window.__dwgInfo.previews[0])||'';
    var F=window.__dwgFacts, prox=window.__dwgProx||{};
    if(!F){stat('Önce ProX ile çözümleyin.','err');return;}
    var kk=F.floorCount||0, tipLbl=prox.buildingTypeLabel||_autoType(F);
    // GERÇEK plan görseli: dosyanın gömülü önizlemesi (gerçek çizim). HD için _dwgUpgradePlan async yükseltir.
    // Faz 1: her kat kendi GERÇEK plan görselini taşır (isimle eşleşir); yoksa gömülü önizleme
    var floorImgs=window.__dwgFloorImgs||[], byName={}; floorImgs.forEach(function(f){byName[f.name]=f.img;});
    var planImg=(floorImgs[0]&&floorImgs[0].img)||(window.__dwgInfo&&window.__dwgInfo.previews&&window.__dwgInfo.previews[0])||thumb||'';
    var fdMap={}; try{_dwgFloorData().forEach(function(d){fdMap[d.name]=d;});}catch(e){}
    var floors=(F.floors||[]).map(function(nm){var d=fdMap[nm]||{};return {name:nm,usage:'',units:[],img:(byName[nm]||planImg),totalM2:d.totalM2||0,rooms:d.rooms||[],unitList:d.units||[]};});
    // eğer _dwgFacts kat bulamadıysa ama plan görselleri varsa, onları kat olarak kullan
    if(!floors.length&&floorImgs.length)floors=floorImgs.map(function(f){var d=fdMap[f.name]||{};return {name:f.name,usage:'',units:[],img:f.img,totalM2:d.totalM2||0,rooms:d.rooms||[],unitList:d.units||[]};});
    var gallery=floorImgs.length?floorImgs.map(function(f){return f.img;}):(planImg?[planImg]:[]);
    // GERÇEK BİRİMLER: dükkan/mağaza/ofis — isim+alan eş-konumundan gerçek m²+kat (araştırma yöntemi)
    var _isDuk=function(n){return /d[üu]kkan|ma[ğg]aza|of[İiı]s|market|büro|buro|ticar|işyer|isyer|at[öo]lye/i.test(n);};
    var realUnits=[]; floors.forEach(function(fl){(fl.unitList||[]).forEach(function(u){if(_isDuk(u.name))realUnits.push({name:u.name,m2:u.m2,kat:fl.name});});});
    var apts=[], nUnits=F.bbCount||0, dn=0, kn=0;
    // GERÇEK DAİRELER (salon-çıpalı segmentasyon) — tip+m²+kat + AYRI plan görseli
    floorImgs.forEach(function(fl){(fl.apts||[]).forEach(function(ap){dn++;apts.push({no:(ap.no?('D'+ap.no):(ap.bbNo?('BB'+ap.bbNo):('D'+dn))),tip:ap.tip||'belirtilmemiş',m2:String(ap.m2||''),est:!!ap.est,guven:ap.guven||'',net:ap.net||0,brut:ap.brut||0,kat:ap.kat||fl.name,cephe:'-',fiyat:'belirtilmemiş',durum:'musait',kind:'daire',plan:ap.img||'',rooms:ap.rooms||[]});});});
    // BB Alan Cetveli var ama hiçbir kata eşleşmediyse (kat kolonu boş) → cetveli düz otoriter liste olarak ekle
    try{var _bb=_dwgBB(); if(_bb.length && !apts.some(function(a){return a.est===false;})){ apts=[]; dn=0;
      _bb.forEach(function(r){dn++;var m2=Math.round(r.net||r.brut);apts.push({no:(r.bbNo?('BB'+r.bbNo):('D'+dn)),tip:r.tip||'belirtilmemiş',m2:String(m2),est:false,net:r.net||0,brut:r.brut||0,kat:r.kat||'belirtilmemiş',cephe:'-',fiyat:'belirtilmemiş',durum:'musait',kind:'daire',rooms:[]});}); }
    }catch(e){}
    // GERÇEK DÜKKANLAR (isim+alan eş-konum) — isim+m²+kat
    realUnits.forEach(function(u){kn++;apts.push({no:'K'+kn,tip:u.name,m2:String(u.m2),kat:u.kat,cephe:'-',fiyat:'belirtilmemiş',durum:'musait',kind:'dükkan'});});
    // hiç gerçek birim çıkmadıysa → bağımsız bölüm sayısı kadar slot (admin gerçek oda cetveliyle doldurur)
    if(!apts.length){for(var i=0;i<nUnits;i++)apts.push({no:'D'+(i+1),tip:'belirtilmemiş',m2:'',kat:'belirtilmemiş',cephe:'-',fiyat:'belirtilmemiş',durum:'musait',kind:'daire'});}
    // HER KATA o katın BAĞIMSIZ BÖLÜMLERİNİ ata (kat ham oda-m²'si değil, dairelere bölünmüş gösterim)
    floors.forEach(function(fl){fl.units=apts.filter(function(a){return a.kat===fl.name;}).map(function(a){return a.no;});});
    var areaStr=F.totalArea?(F.totalArea+' m²'):'belirtilmemiş';
    var real='Gerçek veriler (mimari dosyanın Alan Cetvelinden): '+kk+' kat'+(F.bbCount?(' · '+F.bbCount+' bağımsız bölüm'):'')+(F.totalArea?(' · '+F.totalArea+' m² toplam inşaat alanı'):'')+'.';
    var desc=((prox.summary||'')+' '+real).trim()+(ada?(' Ada/Parsel: '+ada+'/'+parsel+'.'):'');
    var proj={t:title,loc:loc,st:'plan',type:tipLbl+(kk?(' · '+kk+' kat'):''),area:areaStr,img:(planImg||'p_home'),
      price:'İletişime geçin',delivery:'Belirlenecek',units:(nUnits?(nUnits+' bağımsız bölüm · '):'')+kk+' kat',desc:desc,progress:0,
      kAdedi:(F.katAdedi||kk||0),kullanim:(F.kullanim||tipLbl||''),yapiSinifi:(F.yapiSinifi||''),
      ada:ada,parsel:parsel,il:il,ilce:ilce,mahalle:mah,
      longDesc:desc+' Kat planı, mimari dosyanın gerçek vektör çiziminden alınmıştır. Daire tipleri (2+1, dubleks vb.) ve fiyatlar dosyada yazılı olmadığından admin panelde tamamlanır.',
      apts:apts,floors:floors,gallery:gallery,
      specs:[{k:'Yapı tipi',v:tipLbl},{k:'Kat sayısı',v:String(kk)}].concat(F.katAdedi?[{k:'Kat adedi (resmi)',v:String(F.katAdedi)}]:[]).concat(F.bbCount?[{k:'Bağımsız bölüm',v:String(F.bbCount)}]:[]).concat(F.yapiSinifi?[{k:'Yapı sınıfı',v:F.yapiSinifi}]:[]).concat(F.totalArea?[{k:'Toplam inşaat alanı',v:F.totalArea+' m²'}]:[]).concat(ada?[{k:'Ada/Parsel',v:ada+'/'+parsel}]:[]),
      dwgFacts:F, dwgModel:{thumb:thumb}};
    PROJECTS.unshift(proj);
    _dwgSave();
    _dwgUpgradePlan(proj); // gerçek vektör plandan HD görsel dene (async), başarırsa görseli yükseltir
    stat('✓ Portföye eklendi: "'+title+'" ('+kk+' kat'+(F.bbCount?' · '+F.bbCount+' bağımsız bölüm':'')+(F.totalArea?' · '+F.totalArea+' m²':'')+'). Daire tiplerini admin → Projeler bölümünde tamamlayın.','ok');
  };
  function _dwgSave(){
    try{if(typeof renderProjects==='function')renderProjects();}catch(e){}
    try{if(typeof admPjList==='function')admPjList();}catch(e){}
    try{if(typeof renderKpi==='function')renderKpi();}catch(e){}
    try{if(typeof saveAll==='function')saveAll();}catch(e){}
  }
  /* ===== Faz 1: GERÇEK kat planı görselleri — çerçeve tespiti + viewBox crop (Y-flip) + rasterize ===== */
  function _floorName(s){s=String(s||'').toUpperCase();if(/BODRUM/.test(s))return 'Bodrum Kat';if(/ZEM/.test(s))return 'Zemin Kat';if(/ÇATI|CATI/.test(s))return 'Çatı Katı';var m=s.match(/(\d+)\.?\s*NORMAL/);if(m)return m[1]+'. Normal Kat';return '';}
  // Bir bbox'ı SVG viewBox override (Y-flip: y=-maxY) ile kesip PNG'ye rasterize et
  function _dwgCropRaster(svg,f,maxW){
    return new Promise(function(resolve){
      try{
        var pad=(f.x1-f.x0)*0.02, X0=f.x0-pad, Y1=f.y1+pad, w=(f.x1-f.x0)+2*pad, h=(f.y1-f.y0)+2*pad;
        if(!(w>0&&h>0)){resolve('');return;}
        var W=maxW||1500, H=Math.max(1,Math.min(6000,Math.round(W*(h/w))));
        var nvb=X0+' '+(-Y1)+' '+w+' '+h; // Y-flip: SVG_y=-DWG_y
        var sized=svg.replace(/viewBox="[^"]+"/,'viewBox="'+nvb+'"').replace(/width="100%"/,'width="'+W+'"').replace(/height="100%"/,'height="'+H+'"');
        var url=URL.createObjectURL(new Blob([sized],{type:'image/svg+xml'})), img=new Image(), done=false;
        var to=setTimeout(function(){if(!done){done=true;try{URL.revokeObjectURL(url);}catch(e){}resolve('');}},25000);
        img.onload=function(){ if(done)return; done=true; clearTimeout(to);
          try{var cv=document.createElement('canvas');cv.width=W;cv.height=H;var ctx=cv.getContext('2d');ctx.fillStyle='#0b0d12';ctx.fillRect(0,0,W,H);ctx.drawImage(img,0,0,W,H);
            var png=cv.toDataURL('image/jpeg',0.86); URL.revokeObjectURL(url); resolve(png&&png.length>3000?png:'');
          }catch(e){try{URL.revokeObjectURL(url);}catch(_){}resolve('');}
        };
        img.onerror=function(){if(!done){done=true;clearTimeout(to);try{URL.revokeObjectURL(url);}catch(e){}resolve('');}};
        img.src=url;
      }catch(e){resolve('');}
    });
  }
  // Kat başlıkları + çerçeve adaylarından her kat için temiz plan görseli üret
  function _dwgMakeFloorPlans(){
    var svg=window.__dwgSvg, titles=window.__dwgTitles||[], frames=window.__dwgFrames||[];
    if(!svg||svg.length<200||!titles.length||!frames.length)return Promise.resolve([]);
    var T=[]; titles.forEach(function(t){var nm=_floorName(t.t);if(nm&&isFinite(t.x))T.push({nm:nm,x:t.x,y:t.y});});
    if(T.length<2)return Promise.resolve([]);
    T.sort(function(a,b){return a.x-b.x;});
    var sp=(T[T.length-1].x-T[0].x)/Math.max(1,T.length-1); if(!(sp>0))sp=4000;
    var tX0=T[0].x-sp, tX1=T[T.length-1].x+sp;
    // başlık yakınındaki çerçeveler
    var cand=frames.filter(function(f){var cx=(f.x0+f.x1)/2;return cx>tX0&&cx<tX1;});
    if(!cand.length)return Promise.resolve([]);
    // dominant boyut kümesi (antet/detay elenir) — (w,h) yuvarlanmış kova, en kalabalık
    var bk={}; cand.forEach(function(f){var k=Math.round(f.w/400)+'x'+Math.round(f.h/400);(bk[k]=bk[k]||[]).push(f);});
    var best=[]; Object.keys(bk).forEach(function(k){if(bk[k].length>best.length)best=bk[k];});
    if(best.length<2)return Promise.resolve([]);
    // iç/dış çift çerçeveyi dedupe (x0 yakınlığı)
    best.sort(function(a,b){return a.x0-b.x0;});
    var uniq=[]; best.forEach(function(f){if(!uniq.some(function(u){return Math.abs(u.x0-f.x0)<f.w*0.3;}))uniq.push(f);});
    if(uniq.length>12)uniq=uniq.slice(0,12);
    uniq.sort(function(a,b){return a.x0-b.x0;});
    uniq.forEach(function(f){var cx=(f.x0+f.x1)/2;f._t=T.reduce(function(b,tt){return Math.abs(tt.x-cx)<Math.abs(b.x-cx)?tt:b;},T[0]).nm;});
    var _fdM={}; try{_dwgFloorData().forEach(function(d){_fdM[d.name]=d;});}catch(e){}
    // TEK DECODE: büyük SVG'yi bir kez plan-şeridine YÜKSEK ÇÖZÜNÜRLÜKTE raster'la (daire detayı), sonra kat+daire source-rect ile kes
    stat('📐 Kat + daire planları görsele dönüştürülüyor…');
    var mx=Math.min.apply(null,uniq.map(function(f){return f.x0;})), MX=Math.max.apply(null,uniq.map(function(f){return f.x1;}));
    var my=Math.min.apply(null,uniq.map(function(f){return f.y0;})), MY=Math.max.apply(null,uniq.map(function(f){return f.y1;}));
    var padx=(MX-mx)*0.008, pady=(MY-my)*0.02; mx-=padx;MX+=padx;my-=pady;MY+=pady;
    var stripW=MX-mx, stripH=MY-my;
    var floorW=uniq.reduce(function(s,f){return s+(f.x1-f.x0);},0)/uniq.length;
    var imgW=Math.max(1600,Math.min(20000,Math.round(2100*(stripW/Math.max(1,floorW)))));
    var imgH=Math.max(1,Math.min(15000,Math.round(imgW*(stripH/stripW))));
    var nvb=mx+' '+(-MY)+' '+stripW+' '+stripH; // Y-flip: SVG_y=-DWG_y
    // TEMİZ PLAN: kırmızı (aks/ölçü ızgarası) + sarı (ölçü grip) gizle → cyan duvar + mobilya + etiket kalır
    var cleanSvg=svg.replace(/stroke="rgb\(255,0,0\)"/g,'stroke="rgb(255,0,0)" opacity="0"').replace(/stroke="rgb\(255,255,0\)"/g,'stroke="rgb(255,255,0)" opacity="0"');
    var sized=cleanSvg.replace(/viewBox="[^"]+"/,'viewBox="'+nvb+'"').replace(/width="100%"/,'width="'+imgW+'"').replace(/height="100%"/,'height="'+imgH+'"');
    return new Promise(function(resolve){
      var url=URL.createObjectURL(new Blob([sized],{type:'image/svg+xml'})), img=new Image(), done=false;
      var to=setTimeout(function(){if(!done){done=true;try{URL.revokeObjectURL(url);}catch(e){}resolve([]);}},45000);
      img.onerror=function(){if(!done){done=true;clearTimeout(to);try{URL.revokeObjectURL(url);}catch(e){}resolve([]);}};
      img.onload=function(){ if(done)return; done=true; clearTimeout(to);
        try{
          var master=document.createElement('canvas');master.width=imgW;master.height=imgH;
          var mc=master.getContext('2d');mc.fillStyle='#0b0d12';mc.fillRect(0,0,imgW,imgH);mc.drawImage(img,0,0,imgW,imgH);
          URL.revokeObjectURL(url);
          // ortak source-rect kesici (master'dan bir bölgeyi PNG'ye)
          function _srcCrop(rx0,ry0,rx1,ry1,maxW,q){
            var sx=((rx0-mx)/stripW)*imgW, sw=((rx1-rx0)/stripW)*imgW;
            var sy=((MY-ry1)/stripH)*imgH, sh=((ry1-ry0)/stripH)*imgH; // Y-flip: üst = MY
            if(sw<2||sh<2)return '';
            var W2=Math.max(1,Math.min(maxW,Math.round(sw))), H2=Math.max(1,Math.round(W2*(sh/Math.max(1,sw))));
            var cv=document.createElement('canvas');cv.width=W2;cv.height=H2;var c=cv.getContext('2d');c.fillStyle='#0b0d12';c.fillRect(0,0,W2,H2);
            c.drawImage(master,sx,sy,sw,sh,0,0,W2,H2);
            var p=cv.toDataURL('image/jpeg',q||0.72); return p&&p.length>2000?p:'';
          }
          var out=uniq.map(function(f){
            var png=_srcCrop(f.x0,f.y0,f.x1,f.y1,1500,0.86);
            var d=_fdM[f._t]||{};
            var apts=(d.apts||[]).map(function(ap){var b=ap.bbox||{},w=(b.x1-b.x0)||0,h=(b.y1-b.y0)||0;
              var aimg=''; if(w>0&&h>0){var px=w*0.3+250,py=h*0.3+250;aimg=_srcCrop(b.x0-px,b.y0-py,b.x1+px,b.y1+py,1050,0.85);}
              return {tip:ap.tip,m2:ap.m2,est:ap.m2est,guven:ap.guven||'',no:ap.no||'',net:ap.net||0,brut:ap.brut||0,bbNo:ap.bbNo||'',rooms:ap.rooms,kat:ap.kat,img:aimg};});
            return png?{name:f._t,img:png,x0:f.x0,totalM2:d.totalM2,rooms:d.rooms,units:d.units,apts:apts}:null;
          }).filter(Boolean);
          resolve(out);
        }catch(e){resolve([]);}
      };
      img.src=url;
    });
  }
  // Faz 2: kat çerçevelerini seç (Faz1 ile aynı mantık) — hem görsel hem cetvel için
  function _dwgSelectFrames(){
    var titles=window.__dwgTitles||[], frames=window.__dwgFrames||[];
    var T=[]; titles.forEach(function(t){var nm=_floorName(t.t);if(nm&&isFinite(t.x))T.push({nm:nm,x:t.x,y:t.y});});
    if(T.length<2||!frames.length)return [];
    T.sort(function(a,b){return a.x-b.x;});
    var sp=(T[T.length-1].x-T[0].x)/Math.max(1,T.length-1); if(!(sp>0))sp=4000;
    var cand=frames.filter(function(f){var cx=(f.x0+f.x1)/2;return cx>T[0].x-sp&&cx<T[T.length-1].x+sp;});
    if(!cand.length)return [];
    var bk={}; cand.forEach(function(f){var k=Math.round(f.w/400)+'x'+Math.round(f.h/400);(bk[k]=bk[k]||[]).push(f);});
    var best=[]; Object.keys(bk).forEach(function(k){if(bk[k].length>best.length)best=bk[k];});
    if(best.length<2)return [];
    best.sort(function(a,b){return a.x0-b.x0;});
    var uniq=[]; best.forEach(function(f){if(!uniq.some(function(u){return Math.abs(u.x0-f.x0)<f.w*0.3;}))uniq.push(f);});
    if(uniq.length>12)uniq=uniq.slice(0,12);
    uniq.forEach(function(f){var cx=(f.x0+f.x1)/2;f.name=T.reduce(function(b,tt){return Math.abs(tt.x-cx)<Math.abs(b.x-cx)?tt:b;},T[0]).nm;});
    return uniq.sort(function(a,b){return a.x0-b.x0;});
  }
  // Faz 2: her kat için GERÇEK toplam alan (max A:m²) + oda cetveli (isim + m²) — plan üzerindeki etiketlerden
  var _ROOMRE=/SALON|MUTFAK|YATAK|^ODA|BANYO|WC|HOL|ANTRE|TERAS|BALKON|K[İI]LER|G[İI]YS[İI]|DUŞ|OTURMA|EBEVEYN|ÇOCUK|MERD[İI]VEN|ASANS[ÖO]R|N[İI]Ş|DEPO|D[ÜU]KKAN|VEST[İI]YER|ÇAMAŞIR|MEKAN|OFİS/i;
  // Adlandırılmış BİRİM (ticari/özel) — isim+eş-konum alan ile GERÇEK m² çıkar (araştırma: text-anchor→area)
  var _UNITRE=/^(D[ÜU]KKAN|MA[ĞG]AZA|OF[İI]S|OTOPARK|İŞYER|ISYER|MARKET|ATÖLYE|ATOLYE|BÜRO|BURO|TİCAR|TICAR)/i;
  /* ===== BB (Bağımsız Bölüm) Alan Cetveli — 2019+ dosyalarda daire KESİN net/brüt m² ===== */
  function _pnum2(s){if(!s)return 0;var m=String(s).match(/(\d{1,4})[.,]?(\d{0,2})/);if(!m)return 0;return parseFloat(m[1]+'.'+(m[2]||'0'))||0;}
  // (A) TEXT grid tablosu — "Bağımsız Bölüm Alan Cetveli"
  function _dwgBBCetvel(texts){
    if(!texts||texts.length<8)return [];
    var COL={
      id:/^(b\.?b\.?|ba[ğg][ıi]ms[ıi]z|daire|d\.?no|no|s[ıi]ra)\b|^bb$|^no$/i,
      brut:/br[üu]t/i, net:/\bnet\b|kullan[ıi]m/i,
      tip:/^t[İi]p\b|cins|nitelik|nevi/i, kat:/^kat\b|^blok\b|bulundu[ğg]u/i,
      area:/^alan\b|^m[2²]$|\(m[2²]\)/i
    };
    var cn=Object.keys(COL), hdr=[];
    for(var i=0;i<texts.length;i++){var c=_clean(texts[i].t);if(!c||c.length>18||!isFinite(texts[i].x))continue;
      for(var k=0;k<cn.length;k++){if(COL[cn[k]].test(c)){hdr.push({col:cn[k],x:texts[i].x,y:texts[i].y,t:c});break;}}}
    if(hdr.length<2)return [];
    hdr.sort(function(a,b){return b.y-a.y;});
    var best=null;
    for(var h=0;h<hdr.length;h++){
      var cols={};hdr.forEach(function(r){if(Math.abs(r.y-hdr[h].y)<220){if(!cols[r.col]||Math.abs(r.y-hdr[h].y)<Math.abs(cols[r.col].y-hdr[h].y))cols[r.col]=r;}});
      var nc=Object.keys(cols).length; if(!best||nc>best.nc)best={y:hdr[h].y,cols:cols,nc:nc};
    }
    if(!best||best.nc<2||!(best.cols.net||best.cols.brut||best.cols.area))return [];
    var colArr=Object.keys(best.cols).map(function(k){return {col:k,x:best.cols[k].x};}), hy=best.y;
    var below=texts.map(function(t){return {t:_clean(t.t),x:t.x,y:t.y};}).filter(function(t){return t.t&&isFinite(t.x)&&t.y<hy-5&&t.y>hy-12000;});
    below.sort(function(a,b){return b.y-a.y;});
    var rowTol=150, used=[], rows=[];
    for(var b2=0;b2<below.length;b2++){if(used[b2])continue;var grp=[below[b2]];used[b2]=1;
      for(var c2=b2+1;c2<below.length;c2++){if(!used[c2]&&Math.abs(below[c2].y-below[b2].y)<rowTol){grp.push(below[c2]);used[c2]=1;}}
      rows.push(grp);}
    var recs=[];
    rows.forEach(function(grp){var rec={};
      colArr.forEach(function(cl){var b3=null,bd=1e18;grp.forEach(function(g){var d=Math.abs(g.x-cl.x);if(d<bd){bd=d;b3=g;}});if(b3&&bd<1000)rec[cl.col]=b3.t;});
      var brut=_pnum2(rec.brut), net=_pnum2(rec.net)||_pnum2(rec.area);
      var id=(rec.id||'').replace(/^d[:.]?\s*/i,'').trim();
      var tip=(rec.tip||'').toUpperCase().replace(/\s+/g,'');
      if((net>8&&net<2000)||(brut>8&&brut<2000))
        recs.push({bbNo:id||String(recs.length+1),tip:/\d\s*\+\s*\d|DUBLEKS|ST[ÜU]DYO|STUDYO|D[ÜU]KKAN|OF[İI]S/i.test(tip)?tip:'',brut:brut||0,net:net||0,kat:(rec.kat||'').trim()});
    });
    return recs.length>=2?recs:[];
  }
  // (B) ATTRIB blok yolu — daire bloğu özniteliklerinden
  function _dwgBBFromInserts(inserts){
    if(!inserts||!inserts.length)return [];
    var TAG={net:/net/i,brut:/br[üu]t|brut|gross/i,tip:/tip|type|cins/i,no:/(^|_)no$|num|^bb|daire/i,kat:/kat|floor|blok/i};
    var recs=[];
    inserts.forEach(function(ins){var a=ins.a||[];if(a.length<2)return;var g={};
      a.forEach(function(at){var tag=String(at.g||''),val=String(at.t||'');
        if(TAG.net.test(tag)&&g.net==null)g.net=val; else if(TAG.brut.test(tag)&&g.brut==null)g.brut=val;
        else if(TAG.tip.test(tag)&&g.tip==null)g.tip=val; else if(TAG.no.test(tag)&&g.no==null)g.no=val;
        else if(TAG.kat.test(tag)&&g.kat==null)g.kat=val;});
      var net=_pnum2(g.net),brut=_pnum2(g.brut);
      if((net>8&&net<2000)||(brut>8&&brut<2000))
        recs.push({bbNo:(g.no||String(recs.length+1)).trim(),tip:(g.tip||'').toUpperCase().replace(/\s+/g,''),brut:brut||0,net:net||0,kat:(g.kat||'').trim()});
    });
    return recs.length>=2?recs:[];
  }
  // memoize — SIKI KAPI: yalnızca dosyada GERÇEK "Bağımsız Bölüm Alan Cetveli / Metrekare Cetveli"
  // tablosu VARSA oku. Aksi halde kapı/pencere/doğrama bloklarının ölçüleri (100/220, 500/140) çöp
  // bağımsız bölüm olarak sızıyordu (uydurma). ATTRIB-blok yolu güvenilmez → devre dışı.
  function _dwgBB(){
    if(window.__dwgBBcache)return window.__dwgBBcache;
    var texts=(window.__dwgRaw&&window.__dwgRaw.texts)||[];
    var hasCetvel=false;
    for(var i=0;i<texts.length;i++){var c=_clean(texts[i].t);
      if(/ba[ğg][ıi]ms[ıi]z\s*b[öo]l[üu]m.{0,12}(cetvel|liste)|metrekare\s*cetvel|m[2²]\s*cetvel|net\s*\/\s*br[üu]t\s*cetvel/i.test(c)){hasCetvel=true;break;}}
    var recs=[];
    if(hasCetvel){try{recs=_dwgBBCetvel(texts);}catch(e){}}
    window.__dwgBBcache=recs; return recs;
  }
  // BB kaydını bir kat adına eşle
  function _katMatch(katStr,floorName){
    if(!katStr)return false;
    var a=String(katStr).toUpperCase().replace(/[İIı]/g,'I'), b=String(floorName||'').toUpperCase().replace(/[İIı]/g,'I');
    if(!a||!b)return false;
    if(b.indexOf(a)>=0||a.indexOf(b)>=0)return true;
    var na=(a.match(/\d+/)||[])[0], nb=(b.match(/\d+/)||[])[0];
    var ka=/ZEM/.test(a)?'Z':/BODR/.test(a)?'B':/[ÇC]ATI/.test(a)?'C':/NORMAL|KAT/.test(a)?('N'+(na||'')):('K'+(na||''));
    var kb=/ZEM/.test(b)?'Z':/BODR/.test(b)?'B':/[ÇC]ATI/.test(b)?'C':/NORMAL|KAT/.test(b)?('N'+(nb||'')):('K'+(nb||''));
    return ka===kb&&ka!=='';
  }
  /* ===== SEGMENTASYON YARDIMCILARI (mimari-proje-okuma uzman ajanı doğruladı — ANTRE çıpası) ===== */
  function _segArea(s){var m=String(s).match(/(\d{1,4}[.,]\d{1,2})\s*m[2²]?/i);return m?parseFloat(m[1].replace(',','.')):null;}
  function _segKind(name){var t=String(name).toLowerCase();
    if(/antre/.test(t))return 'antre';
    if(/^hol[üu]?$/.test(t))return 'antre';            // yalnız BAĞIMSIZ "hol" (kat holü DEĞİL)
    if(/salon|oturma|ya[şs]ama/.test(t))return 'salon';
    if(/mutfak/.test(t))return 'mutfak';
    if(/banyo|(^|\s)wc\b/.test(t))return 'banyo';
    if(/yatak|ebeveyn|çocuk|^oda\b/.test(t))return 'yatak';
    if(/balkon|teras/.test(t))return 'balkon';
    return 'diger';}
  function _segNear(x,y,areas,maxD){var bv=0,bd=1e18;for(var i=0;i<areas.length;i++){var d=Math.hypot(areas[i].x-x,areas[i].y-y);if(d<bd){bd=d;bv=areas[i].v;}}return bd<=maxD?bv:0;}
  function _segFloorTotal(T,alanL,halfW){var best=0,bd=1e18;for(var i=0;i<alanL.length;i++){var v=_segArea(alanL[i].t);if(v==null||v<150)continue;if(alanL[i].y>=T.y)continue;if(Math.abs(alanL[i].x-T.x)>=halfW)continue;var d=Math.abs(alanL[i].x-T.x)+Math.abs(alanL[i].y-T.y)*0.3;if(d<bd){bd=d;best=v;}}return best||0;}
  // ANA SEGMENTASYON: kat + bağımsız bölüm (daire/dükkan) — mahal(oda isim)+alan(m²) katmanı eş-konum, ANTRE çıpası
  function _dwgFloorData(){
    var raw=(window.__dwgRaw&&window.__dwgRaw.texts)||[];
    if(!raw.length)return [];
    var ms=[];
    for(var i=0;i<raw.length;i++){var c=_clean(raw[i].t);if(c&&isFinite(raw[i].x))ms.push({t:c,x:raw[i].x,y:raw[i].y,l:raw[i].l||''});}
    // mahal(oda isimleri) + alan(m²) katmanları; yoksa içerikten türet (genel dosya desteği)
    var mahal=ms.filter(function(t){return /^(mahal|oda)$/i.test(t.l);}); // oda isimleri: MAHAL + Oda katmanı
    var alanL=ms.filter(function(t){return /^alan$/i.test(t.l);});
    if(mahal.length<4)mahal=ms.filter(function(t){return _ROOMRE.test(t.t)&&t.t.length<26&&!/aks|axis|^ax$|kot$/i.test(t.l);});
    if(alanL.length<4)alanL=ms.filter(function(t){return /(\d{1,4}[.,]\d{1,2})\s*m[2²]/i.test(t.t)&&t.t.length<18;});
    // KAT BAŞLIKLARI — "PLANI" zorunlu değil; aynı kata düşen tekrar başlıkları elenir (isimle dedupe)
    var titRaw=ms.filter(function(t){return _isFloorTitle(t.t);}).sort(function(p,q){return p.x-q.x;});
    var titles=[],tseen={};for(var tt=0;tt<titRaw.length;tt++){var fn=_floorName(titRaw[tt].t)||titRaw[tt].t;if(!tseen[fn]){tseen[fn]=1;titles.push(titRaw[tt]);}}
    if(titles.length<2)return [];
    var dx=Math.abs(titles[1].x-titles[0].x)||4000, halfW=dx*0.45, upH=dx*1.8, maxD=Math.max(dx*0.06,200);
    var out=[];
    for(var ti=0;ti<titles.length;ti++){
      var T=titles[ti], name=_floorName(T.t)||(_clean(T.t).replace(/\s*Ö.*/i,'').replace(/KAT PLANI/i,'Kat').trim());
      // kat kolonu: başlığın ÜSTÜNDEKİ bant (odalar başlığın üstünde)
      var col=mahal.filter(function(t){return Math.abs(t.x-T.x)<halfW && t.y>T.y && t.y<T.y+upH;});
      var colAreasRaw=alanL.filter(function(t){return Math.abs(t.x-T.x)<halfW && t.y>T.y && t.y<T.y+upH;});
      var colAreas=[]; for(var ca=0;ca<colAreasRaw.length;ca++){var av=_segArea(colAreasRaw[ca].t);if(av!=null&&av>0.5&&av<3000)colAreas.push({v:av,x:colAreasRaw[ca].x,y:colAreasRaw[ca].y});}
      var AR=colAreas.length?colAreas:[]; // eş-konum için bu katın alan etiketleri
      var totalM2=_segFloorTotal(T,alanL,halfW);
      // KAT ODA CETVELİ: her mahal ismine eş-konum alan (konumla hafif dedupe)
      var rooms=[], rseen={};
      col.forEach(function(r){var k=Math.round(r.x/Math.max(1,maxD))+','+Math.round(r.y/Math.max(1,maxD))+r.t;if(rseen[k])return;rseen[k]=1;rooms.push({name:r.t.slice(0,18),m2:Math.round(_segNear(r.x,r.y,AR,maxD)*10)/10});});
      var antres=col.filter(function(t){return _segKind(t.t)==='antre';});
      var salonsC=col.filter(function(t){return _segKind(t.t)==='salon';});
      var mutfaksC=col.filter(function(t){return _segKind(t.t)==='mutfak';});
      var duks=col.filter(function(t){return /d[üu]kkan|ma[ğg]aza/i.test(t.t);});
      // ÇIPA: ANTRE (uzman-doğrulanmış güvenilir tek çıpa). ≥2 antre = çok-daireli kat.
      // Antre yoksa (villa/tek-birim veya salon/mutfak etiketi kesit gürültüsü olabilir) → sahte daire ÜRETME.
      var anchors=[], anchorKind='';
      if(antres.length>=2){anchors=antres;anchorKind='antre';}
      var _unusedSeg=salonsC.length+mutfaksC.length; // (ileride BB-cetvelli dosyalarda kullanılabilir)
      var units=[], apts=[];
      if(anchors.length>=2){
        // --- DAİRE KATI: seçilen ÇIPA + en-yakın-oda ataması ---
        var restRooms=col.filter(function(t){return anchors.indexOf(t)<0 && !/^\d{1,2}$/.test(t.t) && !/d[üu]kkan|ma[ğg]aza/i.test(t.t) && !/kat\s*hol|merd|asans|[şs]aft|kovas|sahanl/i.test(t.t);});
        var cores=anchors.map(function(an){return {ax:an.x,ay:an.y,rooms:[{name:an.t,x:an.x,y:an.y}]};});
        restRooms.forEach(function(rr){var bi=0,bd=1e18;cores.forEach(function(c,ci){var d=Math.hypot(c.ax-rr.x,c.ay-rr.y);if(d<bd){bd=d;bi=ci;}});cores[bi].rooms.push({name:rr.t,x:rr.x,y:rr.y});});
        cores.sort(function(p,q){return p.ax-q.ax;});
        // daire no'ları (kat holü lejantında kümeli) — küçükten büyüğe, sol→sağ ata (dosyadaki set, uydurma değil)
        var numPool=col.filter(function(t){return /^\d{1,2}$/.test(t.t);}).map(function(n){return parseInt(n.t,10);}).sort(function(a,b){return a-b;});
        apts=cores.map(function(c,ci){
          var yat=0,hasS=false,total=0,rl=[],bx0=1e18,by0=1e18,bx1=-1e18,by1=-1e18,matched=0;
          c.rooms.forEach(function(ro){var m2=_segNear(ro.x,ro.y,AR,maxD),kind=_segKind(ro.name);
            rl.push({name:_clean(ro.name).slice(0,18),m2:Math.round(m2*10)/10});total+=m2;if(m2>0)matched++;
            if(kind==='yatak')yat++;if(kind==='salon')hasS=true;
            if(ro.x<bx0)bx0=ro.x;if(ro.x>bx1)bx1=ro.x;if(ro.y<by0)by0=ro.y;if(ro.y>by1)by1=ro.y;});
          // TÜR: Türkiye'de her daire salonludur → daima N+1. "N+0" diye TİP YOKTUR (uydurma yasak).
          // yatak varsa yat+1; hiç yatak yoksa 1+1 (salon var) ya da 1+0 stüdyo.
          var tip=(yat>=1)?(yat+'+1'):(hasS?'1+1':'1+0');
          var guven=(matched===c.rooms.length)?'yuksek':(matched>=c.rooms.length-1?'orta':'dusuk');
          var no=(numPool.length===cores.length&&numPool.length)?String(numPool[ci]):'';
          return {tip:tip,m2:Math.round(total),m2est:true,guven:guven,no:no,rooms:rl,bbox:{x0:bx0,y0:by0,x1:bx1,y1:by1},kat:name};
        }).filter(function(a){return a.rooms.length>=2;});
      } else if(duks.length>=1){
        // --- DÜKKAN/HİZMET KATI: her DÜKKAN etiketi bir bağımsız bölüm ---
        var extras=col.filter(function(t){return !/d[üu]kkan|ma[ğg]aza/i.test(t.t) && !/^\d{1,2}$/.test(t.t);});
        var shops=duks.map(function(d){return {sx:d.x,sy:d.y,rooms:[],raw:d.t};});
        extras.forEach(function(ex){var bi=0,bd=1e18;shops.forEach(function(s,si){var d=Math.hypot(s.sx-ex.x,s.sy-ex.y);if(d<bd){bd=d;bi=si;}});if(shops.length)shops[bi].rooms.push({name:ex.t,x:ex.x,y:ex.y});});
        shops.sort(function(p,q){return p.sx-q.sx;});
        units=shops.map(function(sh,si){var shM2=_segNear(sh.sx,sh.sy,AR,maxD*1.6),ex=0;sh.rooms.forEach(function(r){ex+=_segNear(r.x,r.y,AR,maxD);});
          return {name:(/ma[ğg]aza/i.test(sh.raw)?'Mağaza ':'Dükkan ')+(si+1),m2:Math.round((shM2+ex)*10)/10};})
          .filter(function(u){return u.m2>=8;}) // <8 m² = WC/hizmet (yanlış "dükkan" etiketi), gerçek dükkan değil
          .map(function(u,i){return {name:(/ma[ğg]aza/i.test(u.name)?'Mağaza ':'Dükkan ')+(i+1),m2:u.m2};});
      }
      // BB Alan Cetveli varsa (2019+): tahmini m² YERİNE gerçek net/brüt geç (kat eşleşince)
      var bbAll=[]; try{bbAll=_dwgBB();}catch(e){}
      if(bbAll.length){var bbHere=bbAll.filter(function(r){return _katMatch(r.kat,name);});
        if(bbHere.length){bbHere.sort(function(a,b){return (b.net||b.brut)-(a.net||a.brut);});var estA=apts.slice();
          apts=bbHere.map(function(r,ri){var e=estA[ri]||{};return {tip:r.tip||e.tip||'',m2:Math.round(r.net||r.brut),m2est:false,net:r.net||0,brut:r.brut||0,bbNo:r.bbNo,no:r.bbNo||'',guven:'yuksek',rooms:e.rooms||[],bbox:e.bbox,kat:name};});}}
      var fx0=T.x-halfW, fx1=T.x+halfW, fy0=T.y, fy1=T.y+upH;
      out.push({name:name, x0:fx0, totalM2:Math.round(totalM2*10)/10, rooms:rooms, units:units, apts:apts, frame:{x0:fx0,y0:fy0,x1:fx1,y1:fy1}});
    }
    // TİPİK-KAT toplam alan propagasyonu (özdeş normal katlar — mimar yalnız birine yazmış)
    var typ=0; for(var z=0;z<out.length;z++){if(/normal/i.test(out[z].name)&&out[z].totalM2){typ=out[z].totalM2;break;}}
    if(typ)for(var z2=0;z2<out.length;z2++){if(/normal/i.test(out[z2].name)&&!out[z2].totalM2)out[z2].totalM2=typ;}
    return out;
  }
  function _renderFloorPlans(fp){
    var box=el('dwgFloorPlans'); if(!box)return;
    var fd=(function(){try{var m={};_dwgFloorData().forEach(function(d){m[d.name]=d;});return m;}catch(e){return {};}})();
    if(!fp||!fp.length){box.innerHTML='';return;}
    var h='<div style="background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:16px;margin-top:14px">';
    h+='<h3 style="margin:0 0 4px;font-family:var(--head)">📐 Kat Planları <span style="font-size:11px;color:var(--muted);font-weight:400">(dosyanın gerçek çiziminden — '+fp.length+' kat)</span></h3>';
    h+='<div style="font-size:11px;color:var(--muted);margin:0 0 12px">Her kat, mimari dosyadaki gerçek vektör plandan otomatik kırpıldı. Portföye eklediğinizde proje sayfasında kat kat görünür.</div>';
    h+='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:10px">';
    fp.forEach(function(f){var d=fd[f.name]||{};var meta=(d.totalM2?('<b style="color:var(--accent)">'+d.totalM2+' m²</b>'):'')+(d.rooms&&d.rooms.length?(' · '+d.rooms.length+' mahal'):'');
      h+='<div style="border:1px solid var(--line);border-radius:10px;overflow:hidden;background:#0b0d12">'+
        '<img src="'+f.img+'" alt="'+_esc(f.name)+'" style="width:100%;height:150px;object-fit:cover;display:block;cursor:zoom-in" onclick="dwgZoom(\''+f.img+'\')">'+
        '<div style="padding:6px 8px"><div style="font-size:12.5px;font-weight:700;color:var(--ink)">'+_esc(f.name)+'</div>'+(meta?'<div style="font-size:11px;color:var(--muted);margin-top:1px">'+meta+'</div>':'')+'</div></div>';});
    h+='</div>';
    // GERÇEK DAİRELER — her dairenin ayrı planı + tip + m² (salon-çıpalı segmentasyon)
    var allApts=[]; fp.forEach(function(f){(f.apts||[]).forEach(function(a){if(a.img)allApts.push(a);});});
    if(allApts.length){h+='<div style="margin-top:14px;font-size:11.5px;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;margin-bottom:8px">🏠 Daireler — her dairenin ayrı planı ('+allApts.length+' daire)'+_srcTag('measured')+'</div>';
      h+='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px">';
      allApts.forEach(function(a){h+='<div style="border:1px solid var(--line);border-radius:10px;overflow:hidden;background:#0b0d12"><img src="'+a.img+'" alt="daire" style="width:100%;height:130px;object-fit:cover;display:block;cursor:zoom-in" onclick="dwgZoom(\''+a.img+'\')"><div style="padding:6px 8px"><div style="font-size:12.5px;font-weight:800;color:var(--accent)">'+_esc(a.tip)+' <span style="color:var(--ink);font-weight:600">· '+a.m2+' m²</span></div><div style="font-size:10px;color:var(--muted)">'+_esc(a.kat)+'</div></div></div>';});
      h+='</div>';}
    // GERÇEK BİRİMLER (dükkan/otopark vb.) — isim+alan eş-konumundan gerçek m² (araştırma yöntemi: text-anchor→area)
    var allUnits=[]; fp.forEach(function(f){var d=fd[f.name];if(d&&d.units)d.units.forEach(function(u){allUnits.push({kat:f.name,name:u.name,m2:u.m2});});});
    if(allUnits.length){h+='<div style="margin-top:14px;background:rgba(22,163,74,.08);border:1px solid rgba(22,163,74,.35);border-radius:10px;padding:11px"><div style="font-size:12px;font-weight:700;color:#16a34a;margin-bottom:7px">🏪 Gerçek birimler (dosyadan, gerçek m²)'+_srcTag('labeled')+'</div><div style="display:flex;flex-wrap:wrap;gap:6px">'+allUnits.map(function(u){return '<span style="font-size:11.5px;background:var(--surface-2);border:1px solid var(--line);border-radius:7px;padding:3px 9px">'+_esc(u.name)+' <b style="color:var(--accent)">'+u.m2+' m²</b> <span style="color:var(--muted)">· '+_esc(u.kat)+'</span></span>';}).join('')+'</div></div>';}
    // GERÇEK oda cetveli (kat kat) — plan üzerindeki A:m² etiketlerinden
    var anyRooms=fp.some(function(f){var d=fd[f.name];return d&&d.rooms&&d.rooms.length;});
    if(anyRooms){h+='<div style="margin-top:14px;font-size:11.5px;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px">📋 Kat kat mahal cetveli (gerçek m²)</div>';
      fp.forEach(function(f){var d=fd[f.name];if(!d||!d.rooms||!d.rooms.length)return;
        h+='<details style="margin-bottom:6px"><summary style="cursor:pointer;font-size:12.5px;font-weight:700;color:var(--ink)">'+_esc(f.name)+' <span style="color:var(--muted);font-weight:400">· '+(d.totalM2||'?')+' m² · '+d.rooms.length+' mahal</span></summary>'+
          '<div style="display:flex;flex-wrap:wrap;gap:4px;margin:6px 0 4px">'+d.rooms.map(function(r){return '<span style="font-size:10.5px;background:var(--surface-2,rgba(120,120,140,.08));border:1px solid var(--line);border-radius:6px;padding:2px 7px;color:var(--muted)">'+_esc(r.name)+' <b style="color:var(--ink)">'+r.m2+'</b></span>';}).join('')+'</div></details>';});
    }
    h+='</div>';
    box.innerHTML=h;
  }
  // Gömülü önizleme yoksa: gerçek vektör plandan (dwg_to_svg) rasterize ederek HD plan görseli üret
  function _dwgUpgradePlan(proj){
    try{
      var svg=window.__dwgSvg; if(!svg||svg.length>8000000)return;
      if(proj.gallery&&proj.gallery.length&&/^data:/.test(proj.gallery[0]))return; // gerçek önizleme zaten var
      var vb=(svg.match(/viewBox="([^"]+)"/)||[])[1]; if(!vb)return;
      var p=vb.trim().split(/\s+/).map(Number); if(p.length<4||!(p[2]>0&&p[3]>0))return;
      var ratio=p[2]/p[3]; if(ratio>6||ratio<1/6)return; // aşırı outlier viewBox → atla
      var cw=1600, ch=Math.max(1,Math.round(cw/ratio));
      var sized=svg.replace(/width="100%"/,'width="'+cw+'"').replace(/height="100%"/,'height="'+ch+'"');
      var url=URL.createObjectURL(new Blob([sized],{type:'image/svg+xml'})), img=new Image(), done=false;
      var to=setTimeout(function(){if(!done){done=true;try{URL.revokeObjectURL(url);}catch(e){}}},20000);
      img.onload=function(){ if(done)return; done=true; clearTimeout(to);
        try{var cv=document.createElement('canvas');cv.width=cw;cv.height=ch;var ctx=cv.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,cw,ch);ctx.drawImage(img,0,0,cw,ch);
          var png=cv.toDataURL('image/jpeg',0.85); URL.revokeObjectURL(url);
          if(png&&png.length>3000){proj.img=png;proj.gallery=[png];(proj.floors||[]).forEach(function(f){f.img=png;});_dwgSave();}
        }catch(e){try{URL.revokeObjectURL(url);}catch(_){}}
      };
      img.onerror=function(){if(!done){done=true;clearTimeout(to);try{URL.revokeObjectURL(url);}catch(e){}}};
      img.src=url;
    }catch(e){}
  }
})();
