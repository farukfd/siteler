/* ===================================================================
   content-studio.js — İLERİ EDİTÖRYAL İÇERİK STÜDYOSU (portlanabilir)
   4 site (gayrimenkul/danışman/inşaat/değerleme) ortak motoru.
   Entegrasyon: window.ContentStudio.mount(hostEl, cfg) — cfg site kancaları:
     cfg.vertical   : 'gayrimenkul'|'danisman'|'insaat'|'degerleme'
     cfg.persona    : üretim editör kimliği (metin)
     cfg.city()     : aktif il (prompt'a girer)  → string
     cfg.brand()    : marka adı                   → string
     cfg.ai(body)   : Promise<{answer}>  (çok-sağlayıcı YZ; ProX+DeepSeek+OpenAI+Claude)
     cfg.image(q)   : Promise<[{url,thumb,alt,credit,creditUrl}]>  (Pexels)
     cfg.list()     : mevcut makale dizisi
     cfg.save(arts) : makale dizisini kaydet+yayınla
     cfg.getKeys()/cfg.setKeys(obj) : sağlayıcı/anahtar cfg (provider,dsKey,oaKey,clKey,pexelsKey,*Model)
     cfg.testKey(prov): Promise<bool>  (opsiyonel anahtar testi)
     cfg.toast(msg) : bildirim
     cfg.guard(p)   : prompt'a uydurma-yasak kuralı ekler (opsiyonel)
   Makale şeması (zenginleştirilmiş):
     {id,title,slug,cat,tags[],sum,body,img{url,alt,credit,creditUrl},
      seo{title,desc},status:'draft'|'published',date,words,src,icon}
   =================================================================== */
(function () {
  var CS = {}; window.ContentStudio = CS;
  var HOST = null, CFG = null, DRAFT = null;

  /* ---------- yardımcılar ---------- */
  function esc(s){return (''+(s==null?'':s)).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function slugify(s){return (''+(s||'')).toLocaleLowerCase('tr')
    .replace(/ı/g,'i').replace(/İ/g,'i').replace(/ş/g,'s').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ö/g,'o').replace(/ç/g,'c')
    .replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').replace(/-+/g,'-').slice(0,70);}
  function wordCount(s){return (''+(s||'')).trim().split(/\s+/).filter(Boolean).length;}
  function today(){try{return new Date().toISOString().slice(0,10);}catch(e){return '2026-01-01';}}
  function readingTime(w){return Math.max(2,Math.round((w||0)/180))+' dk okuma';}
  function $(id){return document.getElementById(id);}
  function toast(m){try{(CFG.toast||function(){})(m);}catch(e){}}

  /* ---------- SEO makale prompt'u (≥600 kelime, yapısal) ---------- */
  function buildPrompt(o){
    var city=(CFG.city&&CFG.city())||'', brand=(CFG.brand&&CFG.brand())||'';
    var toneMap={bilgilendirici:'bilgilendirici, güven veren',samimi:'samimi ve akıcı',kurumsal:'kurumsal ve otoriter',ikna:'ikna edici ama abartısız'};
    var langMap={tr:'Türkçe',en:'İngilizce',ar:'Arapça'};
    var p='Sen '+(city?city+' bölgesinde ':'')+'çalışan uzman bir '+(CFG.persona||'içerik editörü')+'sün. '
      +'"'+o.topic+'" konusunda '+(langMap[o.lang]||'Türkçe')+' dilinde, SEO uyumlu, ÖZGÜN ve derinlemesine bir blog makalesi yaz.\n'
      +'Üslup: '+(toneMap[o.tone]||'bilgilendirici')+'. '
      +(o.keywords?('Şu anahtar kelimeleri doğal biçimde geç: '+o.keywords+'. '):'')
      +'Gövde EN AZ '+(o.minWords||600)+' kelime olacak; kısa yazma. '
      +'Alt başlıklar (##), kısa paragraflar ve gerekiyorsa madde işaretleri kullan. '
      +'Yalnızca aşağıdaki formatta yanıt ver, başka hiçbir şey yazma:\n\n'
      +'BASLIK: <en fazla 60 karakter, dikkat çekici>\n'
      +'KATEGORI: <tek-iki kelime kategori>\n'
      +'ETIKETLER: <virgülle 4-6 etiket>\n'
      +'OZET: <140-160 karakter meta açıklama>\n'
      +'GOROG: <2-4 kelimelik İngilizce görsel arama terimi, ör: "modern apartment interior">\n'
      +'GOVDE:\n<Markdown gövde — ## alt başlıklarla, EN AZ '+(o.minWords||600)+' kelime>';
    return (CFG.guard?CFG.guard(p):p);
  }
  function parseOut(text){
    text=''+(text||'');
    function pick(k,stop){var re=new RegExp(k+'\\s*:?\\s*([\\s\\S]+?)(?:\\n\\s*(?:'+stop+')\\s*:|$)','i');var m=re.exec(text);return m?m[1].trim():'';}
    var stops='BASLIK|KATEGORI|ETIKETLER|OZET|GOROG|GOVDE';
    return {
      title:pick('BASLIK',stops).replace(/^["'#\s]+|["'\s]+$/g,''),
      cat:pick('KATEGORI',stops).replace(/[.#]/g,'').trim(),
      tags:pick('ETIKETLER',stops),
      sum:pick('OZET',stops),
      imgq:pick('GOROG',stops),
      body:pick('GOVDE',stops)
    };
  }

  /* gövdeye sızmış yapısal etiket satırlarını temizle (BASLIK:/KATEGORI:/OZET:/GOROG:/ETIKETLER:/GOVDE:) */
  function _cleanBody(t){
    t=(''+(t||'')).trim(); if(!t)return '';
    if(/\bGOVDE\s*:/i.test(t)&&/^\s*(BASLIK|KATEGORI|ETIKETLER|OZET|GOROG)\s*:/i.test(t)){ t=t.replace(/^[\s\S]*?\bGOVDE\s*:?\s*/i,''); }
    t=t.replace(/^\s*(BASLIK|KATEGORI|ETIKETLER|OZET|GOROG|GOVDE)\s*:.*$/gim,'');
    return t.replace(/^\s+/,'').trim();
  }

  /* ---------- ÜRETİM ÇEKİRDEĞİ (headless — hem tekli hem batch kullanır) ---------- */
  var _uidc=0; function _uid(){_uidc=(_uidc+1)%1000;return Date.now()*1000+_uidc;}
  function _sleep(ms){return new Promise(function(r){setTimeout(r,ms);});}
  async function _aiText(body,tries){
    tries=tries||3;
    for(var i=0;i<tries;i++){
      try{ var r=await CFG.ai(body); var t=r&&(r.answer||r.text||(r.data&&(r.data.answer||r.data.text))); if(r&&r.fallback)t=null; if(t&&(''+t).trim())return (''+t).trim(); }catch(e){}
      if(i<tries-1)await _sleep(1500*(i+1));/* rate-limit → artan backoff (1.5s,3s) */
    }
    return null;
  }
  async function _genOne(o,st){
    st=st||function(){};
    var text=await _aiText({persona:'office',tool:'blog',prompt:buildPrompt(o)},3);
    if(!text)return null;
    var g=parseOut(text);
    if(!g.body){g.body=_cleanBody(text);if(!g.title)g.title=o.topic;}
    g.body=_cleanBody(g.body);
    var wc=wordCount(g.body);
    if(!o.noExpand&&wc<o.minWords){ st('genişletiliyor');
      var ep='Aşağıdaki makaleyi, aynı konu ve üslupta, EN AZ '+o.minWords+' kelimeye çıkacak şekilde GENİŞLET (yeni ## alt başlıklar, örnekler, detaylar ekle). Sadece genişletilmiş Markdown gövdeyi döndür (BASLIK/KATEGORI gibi etiket satırı EKLEME):\n\n'+g.body;
      var t2=_cleanBody(await _aiText({persona:'office',tool:'blog',prompt:(CFG.guard?CFG.guard(ep):ep)},2));
      if(t2&&wordCount(t2)>wc){g.body=t2;wc=wordCount(g.body);}
    }
    if(wc<40)return null;/* çok kısa/boş yanıt → başarısız say (atla/tekrar dene) */
    return {
      id:_uid(), title:g.title||o.topic, slug:slugify(g.title||o.topic), cat:g.cat||'Genel',
      tags:(g.tags||'').split(/[,;]/).map(function(s){return s.trim();}).filter(Boolean).slice(0,8),
      sum:g.sum||'', body:g.body||'', blocks:CS.mdToBlocks(g.body||''), imgq:g.imgq||o.topic, img:null,
      seo:{title:(g.title||o.topic).slice(0,60),desc:(g.sum||'').slice(0,160)},
      status:'draft', date:today(), words:wc, src:'ai', icon:'📝'
    };
  }
  async function _attachImage(a){ try{var res=await CFG.image(a.imgq||a.title); if(res&&!res._err&&res.length){var p=res[0];a.img={url:p.url,alt:p.alt||a.title,credit:p.credit,creditUrl:p.creditUrl};}}catch(e){} return a; }

  /* ---------- TEKLİ ÜRETİM (editöre) ---------- */
  CS.generate = async function(){
    var topic=($('cs_topic')||{}).value||''; topic=topic.trim();
    if(!topic){toast('Lütfen bir konu/başlık girin.');return;}
    var o={topic:topic,keywords:(($('cs_kw')||{}).value||'').trim(),tone:(($('cs_tone')||{}).value||'bilgilendirici'),lang:(($('cs_lang')||{}).value||'tr'),minWords:parseInt(($('cs_len')||{}).value||'600',10)||600};
    var btn=$('cs_genBtn'); if(btn){btn._t=btn.textContent;btn.disabled=true;btn.textContent='✍️ Üretiliyor…';}
    _status('YZ makaleyi yazıyor… (sağlayıcı: '+_provLabel()+')','wait');
    var a=await _genOne(o,function(){_status('Makale genişletiliyor (≥'+o.minWords+' kelime)…','wait');});
    if(btn){btn.disabled=false;btn.textContent=btn._t;}
    if(!a){ var hint=_hasAnyKey()?'Seçili sağlayıcıya ulaşılamadı — anahtarı "Kaydet & Test Et" ile doğrulayın.':'Önce bir anahtar girin: ⚙️ Ayarlar → ProX / DeepSeek / OpenAI / Claude.';
      _status('YZ yanıt vermedi. '+hint,'err'); var d=$('cs_set'); if(d&&!_hasAnyKey())d.open=true; return; }
    DRAFT=a; _fillEditor(DRAFT);
    _status('✓ Makale üretildi ('+a.words+' kelime'+(a.words>=o.minWords?', hedef tamam':', hedefin altında')+'). Görsel aranıyor…','ok');
    CS.findImage(DRAFT.imgq);
  };

  /* ---------- GÜNLÜK OTOMATİK HABER: batch üret + zamanla ---------- */
  function _todayAt(hour,min){ var d=new Date(); d.setHours(hour||0,min||0,0,0); return d.getTime(); }
  CS.getSched=function(){ var s=(CFG.getSchedule&&CFG.getSchedule())||{}; return {enabled:(s.enabled!==false),startHour:(s.startHour!=null?s.startHour:8),count:(s.count||10),everyMin:(s.everyMin||60),topics:s.topics||''}; };
  CS.saveSched=function(){ var s={enabled:!!($('cs_schEnable')||{}).checked,startHour:parseInt(($('cs_schStart')||{}).value||'8',10),count:parseInt(($('cs_schCount')||{}).value||'10',10),everyMin:parseInt(($('cs_schEvery')||{}).value||'60',10),topics:($('cs_schTopics')||{}).value||''};
    if(CFG.setSchedule)CFG.setSchedule(s); toast('✓ Zamanlayıcı ayarları kaydedildi.'); };
  function _topicList(){
    var s=CS.getSched(); var raw=(s.topics||'').split('\n').map(function(x){return x.trim();}).filter(Boolean);
    if(raw.length)return raw;
    var pool=(CFG.topicPool&&CFG.topicPool())||['Sektörel güncel gelişmeler','Bölge analizi ve yatırım fırsatları','Alıcılar için rehber','Satıcılar için ipuçları','Piyasa trendleri'];
    return pool;
  }
  CS.generateBatch=async function(){
    var s={startHour:parseInt(($('cs_schStart')||{}).value||'8',10),count:parseInt(($('cs_schCount')||{}).value||'10',10),everyMin:parseInt(($('cs_schEvery')||{}).value||'60',10),minWords:600,tone:'bilgilendirici',lang:'tr'};
    var topics=_topicList(); var city=(CFG.city&&CFG.city())||'';
    var btn=$('cs_batchBtn'); if(btn){btn._t=btn.textContent;btn.disabled=true;}
    var arts=(CFG.list&&CFG.list())||[]; var now=Date.now(); var made=0,fail=0;
    var base=_todayAt(s.startHour,0);
    for(var i=0;i<s.count;i++){
      var topic=topics[i%topics.length]+(city?(' — '+city):'')+(topics.length<s.count?(' ('+(Math.floor(i/topics.length)+1)+')'):'');
      if(btn)btn.textContent='Üretiliyor '+(i+1)+'/'+s.count+'…';
      _status('📰 Günlük haber üretiliyor '+(i+1)+'/'+s.count+' — "'+topic+'"'+(fail?(' · '+fail+' atlandı'):''),'wait');
      /* haber gövdesi ProX'ta kısa gelir → expand ile ~300+ kelimeye çıkar (kısa/boş ise atlanır) */
      var a=await _genOne({topic:topic,keywords:'',tone:s.tone,lang:s.lang,minWords:s.minWords},function(){});
      if(!a){ fail++; await _sleep(3000); continue; }/* rate-limit → bu haberi ATLA, bekle, devam et (batch'i kırma) */
      a=await _attachImage(a);
      a.publishAt=base+i*s.everyMin*60000;
      a.status=(a.publishAt<=now)?'published':'scheduled';
      arts.unshift(a); made++;
      if(CFG.save)CFG.save(arts); CS.renderList();
      if(i<s.count-1)await _sleep(2200);/* ProX ardışık çağrı rate-limit'ini yumuşat */
    }
    if(btn){btn.disabled=false;btn.textContent=btn._t;}
    var pub=arts.filter(function(x){return x.status==='published';}).length, sc=arts.filter(function(x){return x.status==='scheduled';}).length;
    _status((made?'✓ '+made+' haber üretildi'+(fail?(', '+fail+' atlandı (rate-limit — tekrar deneyin)'):'')+'. '+(sc?sc+' zamanlandı, ':'')+'zamanı gelen /blog\'da yayında.':'Üretilemedi ('+fail+' atlandı). ProX rate-limit olabilir; sağlayıcıyı DeepSeek/OpenAI yapıp tekrar deneyin.'),made?'ok':'err');
    CS.runSchedule();
  };
  /* Zamanı gelen scheduled → published (statik "lazy-cron"; her sayfa yüklemesinde çalışır) */
  CS.runSchedule=function(){/* admin — zamanı geleni yayınla (master switch AÇIK ise) */
    var arts=(CFG.list&&CFG.list())||[]; var now=Date.now(),ch=false;var s=CS.getSched();
    if(s.enabled!==false)arts.forEach(function(a){ if(a.status==='scheduled'&&a.publishAt&&a.publishAt<=now){a.status='published';ch=true;} });
    if(ch&&CFG.save)CFG.save(arts);
    return arts.filter(function(a){return a.status==='scheduled';}).length;
  };
  /* window.csRunSchedule app.js'te tanımlı (public sayfalarda studio mount olmadan çalışır) */
  CS.toggleAutomation=function(on){var s=CS.getSched();s.enabled=!!on;if(CFG.setSchedule)CFG.setSchedule(s);var ch=$('cs_schEnable');if(ch)ch.checked=!!on;CS.runSchedule();CS.renderList();_status(on?'▶️ Otomatik yayın AÇIK — zamanı gelen haberler yayınlanır.':'⏸️ Otomatik yayın DURDURULDU — zamanlı haberler bekletiliyor.',on?'ok':'wait');};

  /* ---------- GÖRSEL (Pexels) ---------- */
  CS.findImage = async function(q){
    q=(q||($('cs_imgq')||{}).value||(DRAFT&&DRAFT.imgq)||'').trim(); if(!q){toast('Görsel arama terimi girin.');return;}
    var wrap=$('cs_imgResults'); if(wrap)wrap.innerHTML='<div class="cs-muted">Görseller aranıyor…</div>';
    var res=await CFG.image(q);
    if(!res||res._err||!res.length){ if(wrap)wrap.innerHTML='<div class="cs-muted">Görsel bulunamadı. Pexels anahtarı ekleyin (Ayarlar) veya arama terimini değiştirin.</div>'; return; }
    if(wrap)wrap.innerHTML=res.slice(0,8).map(function(p,i){return '<button type="button" class="cs-img'+(DRAFT&&DRAFT.img&&DRAFT.img.url===p.url?' sel':'')+'" onclick="ContentStudio.pickImage('+i+')" title="'+esc(p.credit)+'"><img src="'+esc(p.thumb||p.url)+'" alt="'+esc(p.alt)+'" loading="lazy"></button>';}).join('');
    CS._imgs=res;
    if(!DRAFT.img){CS.pickImage(0);} /* ilkini otomatik seç */
  };
  CS.pickImage = function(i){
    var p=(CS._imgs||[])[i]; if(!p||!DRAFT)return;
    _setCover(p.url,p.alt||DRAFT.title,p.credit,p.creditUrl);
    [].forEach.call(document.querySelectorAll('#cs_imgResults .cs-img'),function(b,bi){b.classList.toggle('sel',bi===i);});
  };
  function _setCover(url,alt,credit,creditUrl){
    if(!DRAFT)DRAFT={id:Date.now(),src:'firma',date:today()};
    DRAFT.img={url:url,alt:alt||DRAFT.title||'',credit:credit||'',creditUrl:creditUrl||''};
    var isUpload=!credit||/yüklenen|yuklenen/i.test(credit)||/^data:/.test(url);
    var label=isUpload?'🖼 Yüklenen görsel':('📷 '+esc(credit));/* credit kaynağı içerir (… · Pexels/Openverse) */
    var prev=$('cs_coverPrev'); if(prev)prev.innerHTML='<img src="'+esc(url)+'" alt="'+esc(alt||'')+'"><span class="cs-credit">'+label+'</span>';
  }
  /* ---------- GÖRSEL: bilgisayardan yükle (küçült + data-URI) ---------- */
  function _readImage(file,maxW,cb){
    try{
      var r=new FileReader();
      r.onload=function(e){
        var img=new Image();
        img.onload=function(){
          try{
            var w=img.width,h=img.height,mx=maxW||1400; if(w>mx){h=Math.round(h*mx/w);w=mx;}
            var cv=document.createElement('canvas');cv.width=w;cv.height=h;
            cv.getContext('2d').drawImage(img,0,0,w,h);
            var out=cv.toDataURL('image/jpeg',0.82);
            cb(out);
          }catch(err){cb(e.target.result);}
        };
        img.onerror=function(){cb(e.target.result);};
        img.src=e.target.result;
      };
      r.readAsDataURL(file);
    }catch(err){toast('Görsel okunamadı.');}
  }
  CS.uploadCover = function(input){
    var f=input&&input.files&&input.files[0]; if(!f)return;
    if(!/^image\//.test(f.type)){toast('Lütfen bir görsel dosyası seçin.');return;}
    toast('Görsel yükleniyor…');
    _readImage(f,1400,function(dataUri){ _setCover(dataUri,($('cs_title')||{}).value||'Kapak','Yüklenen görsel',''); toast('✓ Kapak görseli eklendi.'); });
    input.value='';
  };
  CS.coverFromUrl = function(){
    var u=(($('cs_coverUrl')||{}).value||'').trim(); if(!u)return;
    _setCover(u,($('cs_title')||{}).value||'Kapak','',''); toast('✓ Kapak görseli (URL) eklendi.');
  };
  /* ---------- GÖVDE: imleçte ekleme + biçimlendirme + görsel ekleme ---------- */
  function _insBody(before,after,placeholder){
    var ta=$('cs_body'); if(!ta)return; after=after||''; placeholder=placeholder||'';
    var s=ta.selectionStart||0,e=ta.selectionEnd||0,v=ta.value;
    var sel=v.slice(s,e)||placeholder;
    var ins=before+sel+after;
    ta.value=v.slice(0,s)+ins+v.slice(e);
    var pos=s+before.length; ta.focus(); ta.setSelectionRange(pos,pos+sel.length);
    _syncMeta();
  }
  CS.fmt = function(kind){
    if(kind==='b')_insBody('**','**','kalın');
    else if(kind==='h2')_insBody('\n## ','\n','Alt Başlık');
    else if(kind==='h3')_insBody('\n### ','\n','Alt Başlık');
    else if(kind==='ul')_insBody('\n- ','','Madde');
    else if(kind==='quote')_insBody('\n> ','\n','Alıntı');
    else if(kind==='link'){var u=prompt('Bağlantı URL:','https://');if(u)_insBody('[',']('+u+')','bağlantı metni');}
  };
  CS.uploadBodyImage = function(input){
    var f=input&&input.files&&input.files[0]; if(!f){return;}
    if(!/^image\//.test(f.type)){toast('Lütfen bir görsel seçin.');return;}
    toast('Görsel yükleniyor…');
    _readImage(f,1200,function(dataUri){ _insBody('\n![',']('+dataUri+')\n','görsel açıklaması'); toast('✓ Görsel gövdeye eklendi.'); });
    input.value='';
  };
  CS.insertCoverToBody = function(){ if(DRAFT&&DRAFT.img&&DRAFT.img.url){_insBody('\n!['+((DRAFT.img.alt||'görsel'))+']('+DRAFT.img.url+')\n','','');toast('✓ Kapak gövdeye eklendi.');}else toast('Önce kapak görseli seçin.'); };
  CS.togglePreview = function(){
    var pv=$('cs_preview'),bl=$('cs_blocks'),btn=$('cs_pvBtn'); if(!pv||!bl)return;
    if(pv.style.display==='none'||!pv.style.display){ pv.innerHTML=CS.blocksToHtml(DRAFT.blocks||[]); pv.style.display='block'; bl.style.display='none'; var ab=document.querySelector('.cs-addbar');if(ab)ab.style.display='none'; if(btn)btn.textContent='✎ Düzenle'; }
    else { pv.style.display='none'; bl.style.display=''; var ab2=document.querySelector('.cs-addbar');if(ab2)ab2.style.display=''; if(btn)btn.textContent='👁 Önizleme'; }
  };

  /* ---------- EDİTÖR ↔ DRAFT ---------- */
  function _fillEditor(a){
    if($('cs_title'))$('cs_title').value=a.title||'';
    if($('cs_slug'))$('cs_slug').value=a.slug||'';
    if($('cs_cat'))$('cs_cat').value=a.cat||'';
    if($('cs_tags'))$('cs_tags').value=(a.tags||[]).join(', ');
    if($('cs_sum'))$('cs_sum').value=a.sum||'';
    /* gövde artık BLOK modeli — a.blocks yoksa eski Markdown body'den türet */
    DRAFT.blocks=(a.blocks&&a.blocks.length)?a.blocks:CS.mdToBlocks(a.body||'');
    CS.renderBlocks();
    if($('cs_seoTitle'))$('cs_seoTitle').value=(a.seo&&a.seo.title)||'';
    if($('cs_seoDesc'))$('cs_seoDesc').value=(a.seo&&a.seo.desc)||'';
    if($('cs_imgq'))$('cs_imgq').value=a.imgq||'';
    if(a.img&&a.img.url)_setCover(a.img.url,a.img.alt,a.img.credit,a.img.creditUrl);
    else{var prev=$('cs_coverPrev');if(prev)prev.innerHTML='<div class="cs-muted">Kapak görseli yok</div>';}
    if($('cs_video'))$('cs_video').value=(a.video&&a.video.url)||'';
    var vp=$('cs_videoPrev');if(vp)vp.innerHTML=(a.video&&a.video.url&&CS.videoEmbed(a.video.url))?CS.videoHtml(a.video.url,''):'';
    _syncMeta();
  }
  function _collect(){
    if(!DRAFT)DRAFT={id:Date.now(),src:'firma',date:today(),icon:'📝'};
    DRAFT.title=($('cs_title')||{}).value||''; DRAFT.slug=(($('cs_slug')||{}).value||slugify(DRAFT.title)).trim();
    DRAFT.cat=($('cs_cat')||{}).value||'Genel';
    DRAFT.tags=(($('cs_tags')||{}).value||'').split(/[,;]/).map(function(s){return s.trim();}).filter(Boolean);
    DRAFT.sum=($('cs_sum')||{}).value||'';
    /* blocks canlı güncelleniyor; geriye-dönük body (legacy render/özet) + kelime blocksToText'ten */
    if(!DRAFT.blocks||!DRAFT.blocks.length)DRAFT.blocks=CS.mdToBlocks(DRAFT.body||'');
    DRAFT.body=CS.blocksToText(DRAFT.blocks);
    DRAFT.seo={title:(($('cs_seoTitle')||{}).value||DRAFT.title).slice(0,60),desc:(($('cs_seoDesc')||{}).value||DRAFT.sum).slice(0,160)};
    DRAFT.imgq=($('cs_imgq')||{}).value||DRAFT.imgq||'';
    var vv=(($('cs_video')||{}).value||'').trim();DRAFT.video=vv?{url:vv}:null;
    DRAFT.words=wordCount(CS.blocksToText(DRAFT.blocks));
    return DRAFT;
  }
  function _syncMeta(){
    var w=DRAFT&&DRAFT.blocks?wordCount(CS.blocksToText(DRAFT.blocks)):0; var el=$('cs_wc');
    if(el){var ok=w>=600;el.innerHTML='<b style="color:'+(ok?'#1a7f4b':'#c0392b')+'">'+w+' kelime</b> · '+readingTime(w)+' · '+(ok?'✓ SEO uzunluğu yeterli':'≥600 önerilir')+' · '+((DRAFT&&DRAFT.blocks||[]).length)+' blok';}
    if($('cs_slug')&&!$('cs_slug')._touched&&$('cs_title'))$('cs_slug').value=slugify($('cs_title').value);
  }

  /* ---------- KAYDET / YAYINLA ---------- */
  CS.save = function(publish){
    var a=_collect();
    if(!a.title.trim()){toast('Başlık gerekli.');return;}
    if(!a.body.trim()){toast('Gövde boş olamaz.');return;}
    a.status=publish?'published':'draft';
    a.meta=readingTime(a.words)+' · '+a.date;
    var arts=(CFG.list&&CFG.list())||[];
    var ix=-1; for(var i=0;i<arts.length;i++){if(arts[i].id===a.id){ix=i;break;}}
    if(ix>=0)arts[ix]=a; else arts.unshift(a);
    if(CFG.save)CFG.save(arts);
    toast(publish?('✓ "'+a.title+'" yayınlandı — /blog sayfasında görünür.'):'✓ Taslak kaydedildi.');
    CS.renderList();
  };
  CS.newArticle = function(){ DRAFT={id:Date.now(),src:'firma',date:today(),icon:'📝',status:'draft',tags:[],seo:{}}; _fillEditor(DRAFT); if($('cs_topic'))$('cs_topic').value=''; toast('Yeni boş makale.'); };
  CS.edit = function(id){ var a=(CFG.list&&CFG.list()||[]).filter(function(x){return x.id===id;})[0]; if(!a)return; DRAFT=JSON.parse(JSON.stringify(a)); DRAFT.imgq=DRAFT.imgq||DRAFT.title; _fillEditor(DRAFT); try{window.scrollTo(0,0);}catch(e){} };
  CS.del = function(id){ if(!confirm('Bu makale silinsin mi?'))return; var arts=(CFG.list&&CFG.list()||[]).filter(function(x){return x.id!==id;}); if(CFG.save)CFG.save(arts); CS.renderList(); };

  function _hhmm(ts){try{var d=new Date(ts);return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');}catch(e){return '';}}
  CS.publishNow=function(id){var arts=(CFG.list&&CFG.list())||[];var a=arts.filter(function(x){return x.id===id;})[0];if(!a)return;a.status='published';a.publishAt=Date.now();if(CFG.save)CFG.save(arts);toast('✓ Yayınlandı.');CS.renderList();};
  CS.renderList = function(){
    var host=$('cs_list'); if(!host)return; var arts=(CFG.list&&CFG.list())||[];
    var pub=arts.filter(function(a){return a.status==='published'||!a.status;}).length, sc=arts.filter(function(a){return a.status==='scheduled';}).length, dr=arts.filter(function(a){return a.status==='draft';}).length;
    var head='<div class="cs-listhead"><span class="cs-badge pub">'+pub+' yayında</span> <span class="cs-badge sch">'+sc+' zamanlı</span> <span class="cs-badge draft">'+dr+' taslak</span></div>';
    if(!arts.length){host.innerHTML='<div class="cs-muted" style="padding:16px">Henüz makale yok. Üretin, "Günlük Haberler"den toplu üretin veya "Boş makale".</div>';return;}
    host.innerHTML=head+arts.map(function(a){
      var st=a.status||'published';
      var badge=st==='published'?'<span class="cs-badge pub">Yayında</span>':st==='scheduled'?('<span class="cs-badge sch">🕒 '+_hhmm(a.publishAt)+'</span>'):'<span class="cs-badge draft">Taslak</span>';
      return '<div class="cs-row">'
        +'<div class="cs-row-img">'+(a.img&&a.img.url?'<img src="'+esc(a.img.url)+'" alt="">':'<span>'+(a.icon||'📝')+'</span>')+'</div>'
        +'<div class="cs-row-main"><b>'+esc(a.title||'—')+'</b>'
        +'<div class="cs-row-sub">'+esc(a.cat||'Genel')+' · '+(a.words||wordCount(a.body))+' kelime · '+esc(a.date||'')+' · '+badge
        +(a.src==='ai'?' · <span class="cs-badge ai">YZ</span>':'')+'</div></div>'
        +'<div class="cs-row-act">'+(st!=='published'?'<button type="button" title="Şimdi yayınla" onclick="ContentStudio.publishNow('+a.id+')">▲</button>':'')
        +'<button type="button" title="Düzenle" onclick="ContentStudio.edit('+a.id+')">✎</button>'
        +'<button type="button" title="Sil" onclick="ContentStudio.del('+a.id+')">🗑</button></div></div>';
    }).join('');
  };

  function _provLabel(){var k=(CFG.getKeys&&CFG.getKeys())||{};var p=k.provider||'auto';var m={auto:'Otomatik',prox:'ProX',deepseek:'DeepSeek',openai:'OpenAI',claude:'Claude'};return m[p]||p;}
  function _status(msg,kind){var el=$('cs_status');if(!el)return;el.className='cs-status '+(kind||'');el.textContent=msg;}

  /* ---------- ANAHTAR / SAĞLAYICI AYARLARI ---------- */
  CS.saveKeys = function(test){
    var k={provider:($('cs_provider')||{}).value||'auto',
      proxKey:($('cs_proxKey')||{}).value||'',
      dsKey:($('cs_dsKey')||{}).value||'', oaKey:($('cs_oaKey')||{}).value||'', clKey:($('cs_clKey')||{}).value||'', pexelsKey:($('cs_pexKey')||{}).value||''};
    if(CFG.setKeys)CFG.setKeys(k);
    toast('✓ Sağlayıcı & anahtarlar kaydedildi.');
    _status('Aktif sağlayıcı: '+_provLabel()+(k.proxKey?' · ProX anahtarı bağlı':''),'ok');
    _renderProvChips();
    if(test)CS.testActive();
  };
  CS.testActive = async function(){
    _status('Bağlantı test ediliyor ('+_provLabel()+')…','wait');
    try{
      var r=await CFG.ai({message:'Bağlantı testi. Yalnızca "tamam" yaz.'});
      var t=r&&(r.answer||r.text||(r.data&&(r.data.answer||r.data.text))); if(r&&r.fallback)t=null;
      _status(t?('✓ Bağlantı başarılı ('+_provLabel()+'). Artık makale üretebilirsiniz.'):'Bağlantı kurulamadı. Anahtarı kontrol edin. (ProX, tarayıcı CORS\'u nedeniyle yerelde çalışmayabilir; yayında/kendi anahtarınızla çalışır.)', t?'ok':'err');
    }catch(e){_status('Test hatası: '+(e&&e.message||e),'err');}
  };
  function _hasAnyKey(){var k=(CFG.getKeys&&CFG.getKeys())||{};return !!(k.proxKey||k.dsKey||k.oaKey||k.clKey);}
  function _renderProvChips(){
    var host=$('cs_provChips'); if(!host)return; var k=(CFG.getKeys&&CFG.getKeys())||{};
    var defs=[['prox','ProX',!!k.proxKey],['deepseek','DeepSeek',!!k.dsKey],['openai','OpenAI',!!k.oaKey],['claude','Claude',!!k.clKey]];
    host.innerHTML='<span class="cs-chip'+((k.provider||'auto')==='auto'?' on':'')+'" onclick="ContentStudio.setProvider(\'auto\')">Otomatik</span>'
      +defs.map(function(d){return '<span class="cs-chip'+(k.provider===d[0]?' on':'')+(d[2]?' has':'')+'" onclick="ContentStudio.setProvider(\''+d[0]+'\')">'+d[1]+(d[2]?' ✓':'')+'</span>';}).join('');
  }
  CS.setProvider=function(p){var sel=$('cs_provider');if(sel)sel.value=p;var k=(CFG.getKeys&&CFG.getKeys())||{};k.provider=p;if(CFG.setKeys)CFG.setKeys(k);_renderProvChips();_status('Aktif sağlayıcı: '+_provLabel(),'ok');};

  /* ---------- MOUNT (UI) ---------- */
  CS.mount = function(host, cfg){
    HOST=(typeof host==='string')?$(host):host; CFG=cfg||{}; if(!HOST)return;
    if(!$('cs-css')){var st=document.createElement('style');st.id='cs-css';st.textContent=CS_CSS;(document.head||document.documentElement).appendChild(st);}
    var k=(CFG.getKeys&&CFG.getKeys())||{};
    HOST.innerHTML=_html(k);
    // events
    var bind=function(id,ev,fn){var e=$(id);if(e)e.addEventListener(ev,fn);};
    bind('cs_body','input',_syncMeta); bind('cs_title','input',_syncMeta);
    bind('cs_slug','input',function(){$('cs_slug')._touched=true;});
    _syncMeta(); CS.renderList(); _renderProvChips();
    if(DRAFT)_fillEditor(DRAFT);
  };

  CS.tab=function(name,btn){
    [].forEach.call(document.querySelectorAll('#'+ (HOST.id||'csHost') +' .cs-panel'),function(p){p.style.display=(p.getAttribute('data-p')===name)?'':'none';});
    [].forEach.call(document.querySelectorAll('#'+ (HOST.id||'csHost') +' .cs-tab'),function(b){b.classList.toggle('on',b.getAttribute('data-t')===name);});
    if(name==='makale')CS.renderList();
  };
  function _html(k){
    var prov=k.provider||'auto';
    var noKey=!(k.proxKey||k.dsKey||k.oaKey||k.clKey);
    var q=(CFG.proxInfo&&CFG.proxInfo())||null;
    var s=CS.getSched();
    var t0=noKey?'ayar':'uret';
    return ''
    +'<div class="cs-wrap">'
    /* HERO */
    +'<div class="cs-hero"><div class="cs-hero-ic">✨</div><div><h2>İçerik Stüdyosu</h2>'
      +'<p>SEO uyumlu, ProX destekli makaleler + günlük otomatik haber — gerçek görselle <b>/blog</b>\'da yayınlayın.</p></div></div>'
    /* SAĞLAYICI CHIP\'LERİ */
    +'<div class="cs-provbar"><span class="cs-provbar-l">Yapay zekâ:</span><div class="cs-chips" id="cs_provChips"></div></div>'
    +'<div class="cs-status" id="cs_status">'+(noKey?'⚠️ Henüz sağlayıcı anahtarı yok — <b>Ayarlar</b> sekmesinden ProX / DeepSeek / OpenAI / Claude anahtarı girin.':'Aktif sağlayıcı: '+esc(({auto:'Otomatik',prox:'ProX',deepseek:'DeepSeek',openai:'OpenAI',claude:'Claude'})[prov]||prov))+'</div>'
    /* SEKME NAV */
    +'<div class="cs-tabs">'
      +'<button type="button" class="cs-tab'+(t0==='uret'?' on':'')+'" data-t="uret" onclick="ContentStudio.tab(\'uret\',this)">✍️ Makale Üret</button>'
      +'<button type="button" class="cs-tab" data-t="haber" onclick="ContentStudio.tab(\'haber\',this)">📰 Günlük Haber</button>'
      +'<button type="button" class="cs-tab" data-t="makale" onclick="ContentStudio.tab(\'makale\',this)">📄 Makaleler</button>'
      +'<button type="button" class="cs-tab'+(t0==='ayar'?' on':'')+'" data-t="ayar" onclick="ContentStudio.tab(\'ayar\',this)">⚙️ Ayarlar</button>'
    +'</div>'
    /* ===== PANEL: ÜRET ===== */
    +'<div class="cs-panel" data-p="uret"'+(t0!=='uret'?' style="display:none"':'')+'>'
    /* ADIM 1 — ÜRET */
    +'<div class="cs-card"><div class="cs-step"><span class="cs-step-n">1</span><h3>Konu &amp; ayarlar</h3></div>'
      +'<div class="cs-f"><label>Konu / başlık fikri *</label><input id="cs_topic" placeholder="ör. 2026\'da yatırım için doğru bölge nasıl seçilir?"></div>'
      +'<div class="cs-f"><label>Anahtar kelimeler <span class="cs-muted">(SEO — virgülle)</span></label><input id="cs_kw" placeholder="yatırım, bölge analizi, m² fiyat"></div>'
      +'<div class="cs-grid3"><div class="cs-f"><label>Uzunluk</label><select id="cs_len"><option value="600">≈600 kelime</option><option value="800">≈800 kelime</option><option value="1000">≈1000 kelime</option><option value="1200">≈1200 kelime</option></select></div>'
      +'<div class="cs-f"><label>Üslup</label><select id="cs_tone"><option value="bilgilendirici">Bilgilendirici</option><option value="kurumsal">Kurumsal</option><option value="samimi">Samimi</option><option value="ikna">İkna edici</option></select></div>'
      +'<div class="cs-f"><label>Dil</label><select id="cs_lang"><option value="tr">Türkçe</option><option value="en">English</option><option value="ar">العربية</option></select></div></div>'
      +'<div class="cs-actions"><button type="button" class="cs-btn pri lg" id="cs_genBtn" onclick="ContentStudio.generate()">✍️ Makale Üret</button>'
      +'<button type="button" class="cs-btn" onclick="ContentStudio.newArticle()">+ Boş makale</button></div>'
    +'</div>'
    /* ADIM 2 — EDİTÖR */
    +'<div class="cs-card"><div class="cs-step"><span class="cs-step-n">2</span><h3>Editör</h3><span class="cs-wc" id="cs_wc"></span></div>'
      +'<div class="cs-edit">'
        +'<div class="cs-edit-main">'
          +'<div class="cs-f"><label>Başlık</label><input id="cs_title" placeholder="Makale başlığı"></div>'
          +'<div class="cs-grid2"><div class="cs-f"><label>Kalıcı bağlantı (slug)</label><input id="cs_slug"></div>'
          +'<div class="cs-f"><label>Kategori</label><input id="cs_cat"></div></div>'
          +'<div class="cs-f"><label>Etiketler <span class="cs-muted">(virgülle)</span></label><input id="cs_tags"></div>'
          +'<div class="cs-f"><label>İçerik blokları <span class="cs-muted">(paragraf · başlık · görsel · galeri · liste · alıntı)</span></label>'
            +'<div class="cs-blocks" id="cs_blocks"></div>'
            +'<div class="cs-addbar">'
              +'<span class="cs-muted">+ Blok:</span>'
              +'<button type="button" onclick="ContentStudio.addBlock(\'paragraph\')">¶ Paragraf</button>'
              +'<button type="button" onclick="ContentStudio.addBlock(\'header\')">H Başlık</button>'
              +'<button type="button" onclick="ContentStudio.addBlock(\'image\')">🖼 Görsel</button>'
              +'<button type="button" onclick="ContentStudio.addBlock(\'gallery\')">🖼🖼 Galeri</button>'
              +'<button type="button" onclick="ContentStudio.addBlock(\'video\')">🎬 Video</button>'
              +'<button type="button" onclick="ContentStudio.addBlock(\'list\')">• Liste</button>'
              +'<button type="button" onclick="ContentStudio.addBlock(\'quote\')">❝ Alıntı</button>'
              +'<button type="button" id="cs_pvBtn" class="cs-tb-r" onclick="ContentStudio.togglePreview()">👁 Önizleme</button>'
            +'</div>'
            +'<div class="cs-article cs-preview" id="cs_preview" style="display:none"></div>'
          +'</div>'
        +'</div>'
        +'<div class="cs-edit-side">'
          +'<div class="cs-f"><label>Kapak görseli</label><div class="cs-cover" id="cs_coverPrev"><div class="cs-muted">Kapak görseli yok</div></div>'
            +'<div class="cs-imgbtns">'
              +'<label class="cs-btn cs-upl">⬆ Bilgisayardan yükle<input type="file" accept="image/*" onchange="ContentStudio.uploadCover(this)" hidden></label>'
              +'<button type="button" class="cs-btn" onclick="ContentStudio.insertCoverToBody()">➕ Gövdeye ekle</button>'
            +'</div>'
            +'<div class="cs-grid-img" style="margin-top:8px"><input id="cs_imgq" placeholder="Pexels\'te ara (ör. modern apartment)"><button type="button" class="cs-btn" onclick="ContentStudio.findImage()">🔎 Ara</button></div>'
            +'<div class="cs-grid-img" style="margin-top:6px"><input id="cs_coverUrl" placeholder="veya görsel URL yapıştır"><button type="button" class="cs-btn" onclick="ContentStudio.coverFromUrl()">Ekle</button></div>'
            +'<div class="cs-img-results" id="cs_imgResults"></div></div>'
          +'<div class="cs-f"><label>🎬 Video (link) <span class="cs-muted">(opsiyonel · YouTube/Vimeo)</span></label>'
            +'<input id="cs_video" placeholder="https://youtu.be/… — boşsa detayda video alanı çıkmaz" oninput="ContentStudio.onVideoInput()">'
            +'<div class="cs-video-prev" id="cs_videoPrev"></div></div>'
          +'<div class="cs-f"><label>Özet <span class="cs-muted">(meta)</span></label><textarea id="cs_sum" rows="3"></textarea></div>'
          +'<div class="cs-f"><label>SEO başlık</label><input id="cs_seoTitle" maxlength="70"></div>'
          +'<div class="cs-f"><label>SEO açıklama</label><input id="cs_seoDesc" maxlength="160"></div>'
        +'</div>'
      +'</div>'
      +'<div class="cs-actions cs-sticky"><button type="button" class="cs-btn pri" onclick="ContentStudio.save(true)">✓ Kaydet &amp; Yayınla</button>'
      +'<button type="button" class="cs-btn" onclick="ContentStudio.save(false)">Taslak kaydet</button></div>'
    +'</div>'
    +'</div>'/* /panel uret */
    /* ===== PANEL: GÜNLÜK HABER ===== */
    +'<div class="cs-panel" data-p="haber" style="display:none">'
      +'<div class="cs-card"><div class="cs-step"><span class="cs-step-n">📰</span><h3>Günlük Otomatik Haber</h3></div>'
        +'<p class="cs-muted">Belirlenen saatten itibaren <b>saat başı</b> yayınlanacak haberleri toplu üretin. Zamanı gelen haber /blog\'da otomatik görünür; kalanlar zamanı geldikçe yayınlanır. Her haberi Makaleler sekmesinden düzenleyebilirsiniz.</p>'
        +'<div class="cs-grid3"><div class="cs-f"><label>Başlangıç saati (0-23)</label><input id="cs_schStart" type="number" min="0" max="23" value="'+s.startHour+'"></div>'
        +'<div class="cs-f"><label>Haber adedi</label><input id="cs_schCount" type="number" min="1" max="24" value="'+s.count+'"></div>'
        +'<div class="cs-f"><label>Aralık (dakika)</label><input id="cs_schEvery" type="number" min="15" max="240" step="15" value="'+s.everyMin+'"></div></div>'
        +'<div class="cs-f"><label>Konu havuzu <span class="cs-muted">(her satır bir konu — boşsa sektörel otomatik)</span></label><textarea id="cs_schTopics" rows="6" placeholder="Her satıra bir haber konusu yazın…">'+esc(s.topics||'')+'</textarea></div>'
        +'<div class="cs-master"><div><b>Otomatik yayın</b><div class="cs-muted">Zamanı gelen haberler /blog\'da otomatik görünür</div></div>'
          +'<div class="cs-master-btns"><button type="button" class="cs-btn'+(s.enabled?' pri':'')+'" onclick="ContentStudio.toggleAutomation(true)">▶️ Başlat</button>'
          +'<button type="button" class="cs-btn'+(!s.enabled?' pri':'')+'" onclick="ContentStudio.toggleAutomation(false)">⏸️ Durdur</button></div></div>'
        +'<input type="checkbox" id="cs_schEnable"'+(s.enabled?' checked':'')+' style="display:none">'
        +'<div class="cs-actions"><button type="button" class="cs-btn pri lg" id="cs_batchBtn" onclick="ContentStudio.generateBatch()">📰 Günlük Haberleri Üret</button>'
        +'<button type="button" class="cs-btn" onclick="ContentStudio.saveSched()">Ayarları Kaydet</button></div>'
      +'</div>'
    +'</div>'/* /panel haber */
    /* ===== PANEL: MAKALELER ===== */
    +'<div class="cs-panel" data-p="makale" style="display:none"><div class="cs-card"><div class="cs-step"><span class="cs-step-n">📄</span><h3>Makaleler</h3></div><div id="cs_list"></div></div></div>'
    /* ===== PANEL: AYARLAR ===== */
    +'<div class="cs-panel" data-p="ayar"'+(t0!=='ayar'?' style="display:none"':'')+'><div class="cs-card cs-settings" id="cs_set">'
      +'<div class="cs-f"><label>Üretim sağlayıcısı</label><select id="cs_provider" onchange="ContentStudio.setProvider(this.value)">'
        +'<option value="auto"'+(prov==='auto'?' selected':'')+'>Otomatik (anahtarı olanı kullan)</option>'
        +'<option value="prox"'+(prov==='prox'?' selected':'')+'>ProX — emlakekspertizi.com (kotalı)</option>'
        +'<option value="deepseek"'+(prov==='deepseek'?' selected':'')+'>DeepSeek</option>'
        +'<option value="openai"'+(prov==='openai'?' selected':'')+'>OpenAI / ChatGPT</option>'
        +'<option value="claude"'+(prov==='claude'?' selected':'')+'>Anthropic Claude</option></select></div>'
      /* ProX kartı */
      +'<div class="cs-provcard cs-prox"><div class="cs-provcard-h"><b>🔑 ProX API Anahtarı</b><span class="cs-muted">emlakekspertizi.com — veri + YZ + görsel (kotalı)</span></div>'
        +'<input id="cs_proxKey" type="password" value="'+esc(k.proxKey||'')+'" placeholder="prox_...">'
        +(q?'<div class="cs-quota"><div class="cs-quota-bar"><span style="width:'+Math.min(100,Math.round((q.count/(q.max||1))*100))+'%"></span></div><span class="cs-muted">'+q.count+' / '+q.max+' istek (bu ay)</span></div>':'')
        +'<div class="cs-muted" style="margin-top:6px">Girdiğiniz ProX anahtarı doğrudan kullanılır. (Yerelde tarayıcı CORS\'u engelleyebilir; kendi yayında/whitelisted alan adında çalışır.)</div>'
      +'</div>'
      /* BYO providers */
      +'<div class="cs-provcard"><div class="cs-provcard-h"><b>DeepSeek</b><span class="cs-muted">kendi anahtarım</span></div><input id="cs_dsKey" type="password" value="'+esc(k.dsKey||'')+'" placeholder="sk-..."></div>'
      +'<div class="cs-provcard"><div class="cs-provcard-h"><b>OpenAI / ChatGPT</b><span class="cs-muted">kendi anahtarım</span></div><input id="cs_oaKey" type="password" value="'+esc(k.oaKey||'')+'" placeholder="sk-..."></div>'
      +'<div class="cs-provcard"><div class="cs-provcard-h"><b>Anthropic Claude</b><span class="cs-muted">kendi anahtarım</span></div><input id="cs_clKey" type="password" value="'+esc(k.clKey||'')+'" placeholder="sk-ant-..."></div>'
      +'<div class="cs-provcard"><div class="cs-provcard-h"><b>📷 Pexels</b><span class="cs-muted">görsel — boşsa ProX görsel-proxy</span></div><input id="cs_pexKey" type="password" value="'+esc(k.pexelsKey||'')+'" placeholder="Pexels API key"></div>'
      +'<div class="cs-muted" style="margin:8px 0 12px">Anahtarlar yalnız bu yönetim oturumunuzda (tarayıcınızda) saklanır. ProX anahtarsız da kullanılabilir (yayında sunucu-proxy).</div>'
      +'<div class="cs-actions"><button type="button" class="cs-btn pri" onclick="ContentStudio.saveKeys(true)">Kaydet &amp; Test Et</button>'
      +'<button type="button" class="cs-btn" onclick="ContentStudio.saveKeys(false)">Kaydet</button></div>'
    +'</div></div>'/* /settings card, /panel ayar */
    +'</div>';
  }

  /* ---------- PUBLIC: makale SEO enjeksiyonu (blog detay sayfasında çağır) ---------- */
  CS.applyArticleSEO = function(a){
    if(!a)return;
    try{ if(a.seo&&a.seo.title)document.title=a.seo.title; else if(a.title)document.title=a.title;
      var setMeta=function(sel,attr,val){var m=document.querySelector(sel);if(!m){m=document.createElement('meta');var kv=sel.match(/\[(name|property)="([^"]+)"\]/);if(kv)m.setAttribute(kv[1],kv[2]);document.head.appendChild(m);}m.setAttribute('content',val);};
      var d=(a.seo&&a.seo.desc)||a.sum||''; if(d){setMeta('meta[name="description"]','content',d);setMeta('meta[property="og:description"]','content',d);}
      setMeta('meta[property="og:title"]','content',(a.seo&&a.seo.title)||a.title||'');
      setMeta('meta[property="og:type"]','content','article');
      if(a.img&&a.img.url){setMeta('meta[property="og:image"]','content',a.img.url);setMeta('meta[name="twitter:image"]','content',a.img.url);}
      var ld={"@context":"https://schema.org","@type":"BlogPosting","headline":a.title,"description":d,"datePublished":a.date,"articleSection":a.cat,"keywords":(a.tags||[]).join(', '),"author":{"@type":"Organization","name":(CFG&&CFG.brand&&CFG.brand())||''}};
      if(a.img&&a.img.url)ld.image=a.img.url;
      var s=document.getElementById('cs-article-ld'); if(!s){s=document.createElement('script');s.type='application/ld+json';s.id='cs-article-ld';document.head.appendChild(s);} s.textContent=JSON.stringify(ld);
    }catch(e){}
  };
  /* ============================================================
     BLOK MOTORU (Editor.js-şekilli {id,type,data}) — çoklu görsel + caption
     Tipler: paragraph|header|image|gallery|list|quote|delimiter
     Eski Markdown gövdeler mdToBlocks ile bloğa çevrilir; public render blocksToHtml.
     ============================================================ */
  function _bid(){return 'b'+Date.now().toString(36)+Math.floor(Math.random()*46656).toString(36);}
  function _stripMd(s){return (''+(s||'')).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');}
  CS.mdToBlocks = function(md){
    md=''+(md||''); var lines=md.split(/\n/),blocks=[],ul=null;
    var flush=function(){if(ul){blocks.push({id:_bid(),type:'list',data:{style:'unordered',items:ul}});ul=null;}};
    lines.forEach(function(ln){
      var t=ln.trim();
      var mImg=t.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if(mImg){flush();blocks.push({id:_bid(),type:'image',data:{url:mImg[2],caption:'',alt:mImg[1]||''}});return;}
      if(/^###\s+/.test(t)){flush();blocks.push({id:_bid(),type:'header',data:{text:_stripMd(t.replace(/^###\s+/,'')),level:3}});return;}
      if(/^##\s+/.test(t)){flush();blocks.push({id:_bid(),type:'header',data:{text:_stripMd(t.replace(/^##\s+/,'')),level:2}});return;}
      if(/^#\s+/.test(t)){flush();blocks.push({id:_bid(),type:'header',data:{text:_stripMd(t.replace(/^#\s+/,'')),level:2}});return;}
      if(/^>\s?/.test(t)){flush();blocks.push({id:_bid(),type:'quote',data:{text:_stripMd(t.replace(/^>\s?/,'')),caption:''}});return;}
      if(/^[-*]\s+/.test(t)){if(!ul)ul=[];ul.push(_stripMd(t.replace(/^[-*]\s+/,'')));return;}
      if(!t){flush();return;}
      flush();blocks.push({id:_bid(),type:'paragraph',data:{text:_stripMd(t)}});
    });
    flush();
    if(!blocks.length)blocks.push({id:_bid(),type:'paragraph',data:{text:''}});
    return blocks;
  };
  CS.blocksToHtml = function(blocks){
    if(!blocks||!blocks.length)return '';
    var e=esc;
    return blocks.map(function(b){var d=b.data||{};switch(b.type){
      case 'header': return '<h'+(d.level||2)+'>'+(d.text||'')+'</h'+(d.level||2)+'>';
      case 'paragraph': return d.text?('<p>'+d.text+'</p>'):'';
      case 'quote': return '<blockquote><p>'+(d.text||'')+'</p>'+(d.caption?'<cite>'+e(d.caption)+'</cite>':'')+'</blockquote>';
      case 'list': return '<'+(d.style==='ordered'?'ol':'ul')+'>'+(d.items||[]).map(function(i){return '<li>'+(typeof i==='string'?i:(i.content||''))+'</li>';}).join('')+'</'+(d.style==='ordered'?'ol':'ul')+'>';
      case 'image': return '<figure>'+(d.url?'<img src="'+e(d.url)+'" alt="'+e(d.alt||'')+'" loading="lazy">':'')+(d.caption?'<figcaption>'+e(d.caption)+'</figcaption>':'')+'</figure>';
      case 'gallery': return '<figure class="cs-gal cs-gal--'+(d.layout||'grid')+'">'+(d.images||[]).map(function(im){return '<figure><img src="'+e(im.url)+'" alt="'+e(im.alt||'')+'" loading="lazy">'+(im.caption?'<figcaption>'+e(im.caption)+'</figcaption>':'')+'</figure>';}).join('')+(d.caption?'<figcaption class="cs-gal-cap">'+e(d.caption)+'</figcaption>':'')+'</figure>';
      case 'video': return d.url?CS.videoHtml(d.url,d.caption):'';
      case 'delimiter': return '<hr>';
      default: return '';
    }}).join('\n');
  };
  CS.blocksToText = function(blocks){
    if(!blocks||!blocks.length)return '';
    return blocks.map(function(b){var d=b.data||{};if(b.type==='list')return (d.items||[]).map(function(i){return typeof i==='string'?i:(i.content||'');}).join(' ');return (d.text||'')+' '+(d.caption||'');}).join(' ').replace(/<[^>]+>/g,' ');
  };
  function _imgsFromBlocks(blocks){var out=[];(blocks||[]).forEach(function(b){if(b.type==='image'&&b.data.url)out.push(b.data.url);if(b.type==='gallery')(b.data.images||[]).forEach(function(im){if(im.url)out.push(im.url);});});return out;}
  /* Video linkini gömme (embed) URL'sine çevir — YouTube / Vimeo. Tanınmazsa null. */
  CS.videoEmbed=function(url){
    url=(''+(url||'')).trim(); if(!url)return null;
    var m;
    if((m=url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/)))return {src:'https://www.youtube.com/embed/'+m[1],provider:'youtube'};
    if((m=url.match(/vimeo\.com\/(?:video\/)?(\d+)/)))return {src:'https://player.vimeo.com/video/'+m[1],provider:'vimeo'};
    if(/^https:\/\/.+\.(mp4|webm)$/i.test(url))return {src:url,provider:'file'};
    return null;
  };
  CS.videoHtml=function(url,caption){
    var v=CS.videoEmbed(url); if(!v)return '';
    var e=esc;
    var inner=v.provider==='file'
      ? '<video src="'+e(v.src)+'" controls playsinline style="width:100%;height:100%;border:0;display:block"></video>'
      : '<iframe src="'+e(v.src)+'" title="Video" loading="lazy" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe>';
    return '<figure class="cs-video"><div class="cs-video-frame">'+inner+'</div>'+(caption?'<figcaption>'+e(caption)+'</figcaption>':'')+'</figure>';
  };
  CS.onVideoInput=function(){var v=(($('cs_video')||{}).value||'').trim();if(DRAFT)DRAFT.video=v?{url:v}:null;var p=$('cs_videoPrev');if(p)p.innerHTML=v?(CS.videoEmbed(v)?CS.videoHtml(v,''):'<span class="cs-muted">Tanınmayan link (YouTube/Vimeo/.mp4)</span>'):'';};

  /* ============ BLOK EDİTÖRÜ (UI) ============ */
  function _blk(id){return (DRAFT.blocks||[]).filter(function(b){return b.id===id;})[0];}
  function _sanitize(html){var d=document.createElement('div');d.innerHTML=html||'';[].forEach.call(d.querySelectorAll('*'),function(el){if(!/^(B|I|EM|STRONG|A|BR|CODE)$/.test(el.tagName)){el.replaceWith.apply(el,el.childNodes.length?[].slice.call(el.childNodes):[document.createTextNode(el.textContent||'')]);return;}[].slice.call(el.attributes).forEach(function(at){if(el.tagName==='A'&&(at.name==='href'||at.name==='target'||at.name==='rel'))return;el.removeAttribute(at.name);});if(el.tagName==='A'){el.setAttribute('target','_blank');el.setAttribute('rel','noopener');}});return d.innerHTML;}
  var _typeLabel={paragraph:'¶ Paragraf',header:'H Başlık',image:'🖼 Görsel',gallery:'🖼🖼 Galeri',video:'🎬 Video',list:'• Liste',quote:'❝ Alıntı',delimiter:'— Ayraç'};
  CS.renderBlocks=function(){
    var host=$('cs_blocks'); if(!host)return; if(!DRAFT.blocks||!DRAFT.blocks.length)DRAFT.blocks=[{id:_bid(),type:'paragraph',data:{text:''}}];
    host.innerHTML='';
    DRAFT.blocks.forEach(function(b,idx){host.appendChild(_blockEl(b,idx));});
    _syncMeta();
  };
  function _ctrlBar(b){
    var bar=document.createElement('div');bar.className='cs-blk-ctrl';
    bar.innerHTML='<span class="cs-blk-t">'+(_typeLabel[b.type]||b.type)+'</span>'
      +'<span class="cs-blk-btns"><button type="button" title="Yukarı" onclick="ContentStudio.moveBlock(\''+b.id+'\',-1)">↑</button>'
      +'<button type="button" title="Aşağı" onclick="ContentStudio.moveBlock(\''+b.id+'\',1)">↓</button>'
      +'<button type="button" title="Sil" onclick="ContentStudio.delBlock(\''+b.id+'\')">🗑</button></span>';
    return bar;
  }
  function _blockEl(b){
    var el=document.createElement('div');el.className='cs-blk';el.dataset.id=b.id;el.dataset.type=b.type;
    el.appendChild(_ctrlBar(b));
    var body=document.createElement('div');body.className='cs-blk-body';el.appendChild(body);var d=b.data||(b.data={});
    if(b.type==='paragraph'){
      var p=document.createElement('div');p.className='cs-ce';p.contentEditable='true';p.innerHTML=d.text||'';p.setAttribute('data-ph','Paragraf yazın…');
      p.addEventListener('input',function(){d.text=_sanitize(p.innerHTML);_syncMeta();});
      p.addEventListener('keydown',function(ev){if((ev.metaKey||ev.ctrlKey)&&ev.key.toLowerCase()==='b'){ev.preventDefault();document.execCommand('bold');}if((ev.metaKey||ev.ctrlKey)&&ev.key.toLowerCase()==='i'){ev.preventDefault();document.execCommand('italic');}});
      body.appendChild(p);
    } else if(b.type==='header'){
      var row=document.createElement('div');row.className='cs-hrow';
      var sel=document.createElement('select');sel.innerHTML='<option value="2">H2</option><option value="3">H3</option>';sel.value=String(d.level||2);sel.onchange=function(){d.level=+sel.value;};
      var h=document.createElement('div');h.className='cs-ce cs-ce-h';h.contentEditable='true';h.innerHTML=d.text||'';h.setAttribute('data-ph','Başlık…');h.addEventListener('input',function(){d.text=_sanitize(h.innerHTML);_syncMeta();});
      row.appendChild(sel);row.appendChild(h);body.appendChild(row);
    } else if(b.type==='quote'){
      var q=document.createElement('div');q.className='cs-ce';q.contentEditable='true';q.innerHTML=d.text||'';q.setAttribute('data-ph','Alıntı…');q.addEventListener('input',function(){d.text=_sanitize(q.innerHTML);});
      var c=document.createElement('input');c.className='cs-cap';c.placeholder='— kaynak (opsiyonel)';c.value=d.caption||'';c.oninput=function(){d.caption=c.value;};
      body.appendChild(q);body.appendChild(c);
    } else if(b.type==='list'){
      var ta=document.createElement('textarea');ta.rows=4;ta.placeholder='Her satır bir madde…';ta.value=(d.items||[]).map(function(i){return typeof i==='string'?i:(i.content||'');}).join('\n');
      ta.oninput=function(){d.items=ta.value.split('\n').map(function(x){return x.trim();}).filter(Boolean);_syncMeta();};body.appendChild(ta);
    } else if(b.type==='delimiter'){ var hr=document.createElement('div');hr.className='cs-hr';hr.textContent='— — —';body.appendChild(hr);
    } else if(b.type==='image'){
      body.appendChild(_imageEditor(b));
    } else if(b.type==='gallery'){
      body.appendChild(_galleryEditor(b));
    } else if(b.type==='video'){
      body.appendChild(_videoEditor(b));
    }
    return el;
  }
  function _imgSrcRow(onUrl,onUpload,phUrl){
    var row=document.createElement('div');row.className='cs-grid-img';
    var inp=document.createElement('input');inp.placeholder=phUrl||'Görsel URL yapıştır';inp.onchange=function(){onUrl(inp.value.trim());};
    var lab=document.createElement('label');lab.className='cs-btn cs-upl';lab.innerHTML='⬆ Yükle';var f=document.createElement('input');f.type='file';f.accept='image/*';f.hidden=true;f.onchange=function(){onUpload(f);};lab.appendChild(f);
    row.appendChild(inp);row.appendChild(lab);return row;
  }
  function _imageEditor(b){var d=b.data;var wrap=document.createElement('div');
    var prev=document.createElement('div');prev.className='cs-blk-cover';prev.innerHTML=d.url?'<img src="'+esc(d.url)+'" alt="">':'<span class="cs-muted">Görsel yok</span>';wrap.appendChild(prev);
    wrap.appendChild(_imgSrcRow(function(u){d.url=u;prev.innerHTML=u?'<img src="'+esc(u)+'" alt="">':'';},function(f){_readImage(f.files[0],1400,function(du){d.url=du;prev.innerHTML='<img src="'+esc(du)+'" alt="">';});}));
    var cap=document.createElement('input');cap.className='cs-cap';cap.placeholder='Görsel altı not (caption)';cap.value=d.caption||'';cap.oninput=function(){d.caption=cap.value;};wrap.appendChild(cap);
    var alt=document.createElement('input');alt.className='cs-cap';alt.placeholder='Alt metin (SEO/erişilebilirlik)';alt.value=d.alt||'';alt.oninput=function(){d.alt=alt.value;};wrap.appendChild(alt);
    return wrap;
  }
  function _galleryEditor(b){var d=b.data;if(!d.images)d.images=[];if(!d.layout)d.layout='grid';
    var wrap=document.createElement('div');
    var grid=document.createElement('div');grid.className='cs-gal-edit';wrap.appendChild(grid);
    var draw=function(){grid.innerHTML='';d.images.forEach(function(im,i){var cell=document.createElement('div');cell.className='cs-gal-cell';
      cell.innerHTML='<div class="cs-gal-thumb">'+(im.url?'<img src="'+esc(im.url)+'">':'<span class="cs-muted">?</span>')+'<button type="button" class="cs-gal-x" title="Kaldır">×</button></div>';
      var cap=document.createElement('input');cap.className='cs-cap';cap.placeholder='Foto '+(i+1)+' notu';cap.value=im.caption||'';cap.oninput=function(){im.caption=cap.value;};cell.appendChild(cap);
      cell.querySelector('.cs-gal-x').onclick=function(){d.images.splice(i,1);draw();};
      grid.appendChild(cell);});};
    draw();
    var add=document.createElement('div');add.className='cs-gal-add';
    add.appendChild(_imgSrcRow(function(u){if(u){d.images.push({url:u,caption:'',alt:''});draw();}},function(f){_readImage(f.files[0],1400,function(du){d.images.push({url:du,caption:'',alt:''});draw();});},'Galeriye görsel URL ekle'));
    wrap.appendChild(add);
    return wrap;
  }
  function _videoEditor(b){var d=b.data;var wrap=document.createElement('div');
    var prev=document.createElement('div');prev.className='cs-video-prev';wrap.appendChild(prev);
    var draw=function(){var v=CS.videoEmbed(d.url);prev.innerHTML=v?CS.videoHtml(d.url,''):(d.url?'<span class="cs-muted">Tanınmayan video linki (YouTube/Vimeo/.mp4)</span>':'<span class="cs-muted">Video linki yapıştırın</span>');};
    var inp=document.createElement('input');inp.className='cs-cap';inp.placeholder='YouTube / Vimeo linki (ör. https://youtu.be/...)';inp.value=d.url||'';inp.oninput=function(){d.url=inp.value.trim();draw();};
    var cap=document.createElement('input');cap.className='cs-cap';cap.placeholder='Video altı not (opsiyonel)';cap.value=d.caption||'';cap.oninput=function(){d.caption=cap.value;};
    wrap.appendChild(inp);wrap.appendChild(cap);draw();return wrap;
  }
  CS.addBlock=function(type){if(!DRAFT.blocks)DRAFT.blocks=[];var nb={id:_bid(),type:type,data:type==='header'?{text:'',level:2}:type==='list'?{style:'unordered',items:[]}:type==='gallery'?{layout:'grid',images:[]}:type==='image'?{url:'',caption:'',alt:''}:type==='video'?{url:'',caption:''}:type==='quote'?{text:'',caption:''}:type==='delimiter'?{}:{text:''}};DRAFT.blocks.push(nb);CS.renderBlocks();var host=$('cs_blocks');if(host&&host.lastChild)host.lastChild.scrollIntoView({block:'nearest'});};
  CS.delBlock=function(id){DRAFT.blocks=(DRAFT.blocks||[]).filter(function(b){return b.id!==id;});if(!DRAFT.blocks.length)DRAFT.blocks=[{id:_bid(),type:'paragraph',data:{text:''}}];CS.renderBlocks();};
  CS.moveBlock=function(id,dir){var a=DRAFT.blocks||[];var i=a.findIndex(function(b){return b.id===id;});var j=i+dir;if(i<0||j<0||j>=a.length)return;var t=a[i];a[i]=a[j];a[j]=t;CS.renderBlocks();};

  /* Markdown → HTML (başlık/kalın/liste/alıntı/link/görsel) — önizleme + LEGACY public render için */
  CS.mdToHtml = function(md){
    md=''+(md||'');
    var esc2=function(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');};
    var inline=function(s){
      s=esc2(s);
      s=s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,function(m,a,u){return '<img src="'+u.replace(/"/g,'&quot;')+'" alt="'+a+'" loading="lazy" style="max-width:100%;border-radius:10px;margin:8px 0">';});
      s=s.replace(/\[([^\]]+)\]\(([^)]+)\)/g,function(m,t,u){return '<a href="'+u.replace(/"/g,'&quot;')+'" target="_blank" rel="noopener">'+t+'</a>';});
      s=s.replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');
      return s;
    };
    var lines=md.split(/\n/),out=[],inUl=false,inBq=false;
    var closeBlocks=function(){if(inUl){out.push('</ul>');inUl=false;}if(inBq){out.push('</blockquote>');inBq=false;}};
    lines.forEach(function(ln){
      var t=ln.trim();
      if(/^###\s+/.test(t)){closeBlocks();out.push('<h3>'+inline(t.replace(/^###\s+/,''))+'</h3>');return;}
      if(/^##\s+/.test(t)){closeBlocks();out.push('<h2>'+inline(t.replace(/^##\s+/,''))+'</h2>');return;}
      if(/^#\s+/.test(t)){closeBlocks();out.push('<h2>'+inline(t.replace(/^#\s+/,''))+'</h2>');return;}
      if(/^>\s?/.test(t)){if(inUl){out.push('</ul>');inUl=false;}if(!inBq){out.push('<blockquote>');inBq=true;}out.push(inline(t.replace(/^>\s?/,''))+'<br>');return;}
      if(/^[-*]\s+/.test(t)){if(inBq){out.push('</blockquote>');inBq=false;}if(!inUl){out.push('<ul>');inUl=true;}out.push('<li>'+inline(t.replace(/^[-*]\s+/,''))+'</li>');return;}
      if(!t){closeBlocks();return;}
      closeBlocks();
      /* tek başına görsel → figure */
      if(/^!\[[^\]]*\]\([^)]+\)$/.test(t)){out.push('<figure style="margin:10px 0">'+inline(t)+'</figure>');return;}
      out.push('<p>'+inline(t)+'</p>');
    });
    closeBlocks();
    return out.join('\n');
  };

  var CS_CSS=''
  +'.cs-wrap{max-width:960px;margin:0 auto}'
  +'.cs-muted{color:var(--muted,#6b7280);font-size:13px}'
  /* HERO */
  +'.cs-hero{display:flex;gap:16px;align-items:center;padding:20px 22px;border-radius:16px;color:#fff;background:linear-gradient(120deg,var(--accent,#0ea5a5),var(--accent-2,#22d3ee));box-shadow:0 10px 30px -14px rgba(0,0,0,.35)}'
  +'.cs-hero-ic{font-size:34px;line-height:1;filter:drop-shadow(0 2px 6px rgba(0,0,0,.25))}'
  +'.cs-hero h2{margin:0 0 3px;font-size:23px;color:#fff}.cs-hero p{margin:0;font-size:13.5px;line-height:1.55;color:rgba(255,255,255,.92)}.cs-hero b{color:#fff}'
  /* PROVIDER BAR + CHIPS */
  +'.cs-provbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:14px 0 4px}'
  +'.cs-provbar-l{font-size:12.5px;font-weight:700;color:var(--muted,#6b7280)}'
  +'.cs-chips{display:flex;gap:7px;flex-wrap:wrap;flex:1}'
  +'.cs-chip{padding:5px 12px;border-radius:999px;border:1px solid var(--line,#e5e7eb);background:var(--bg,#fff);font-size:12.5px;font-weight:600;cursor:pointer;user-select:none}'
  +'.cs-chip.has{border-color:var(--accent,#0ea5a5)}.cs-chip.on{background:var(--accent,#0ea5a5);color:var(--on-accent,#fff);border-color:transparent}'
  +'.cs-link{background:none;border:none;color:var(--accent,#0ea5a5);font:inherit;font-weight:600;font-size:12.5px;cursor:pointer;text-decoration:underline}'
  +'.cs-status{margin:8px 0 4px;padding:10px 14px;border-radius:10px;background:var(--surface,#f3f4f6);border:1px solid var(--line,#e5e7eb);font-size:13px;line-height:1.5}'
  /* TABS */
  +'.cs-tabs{display:flex;gap:4px;flex-wrap:wrap;margin:14px 0 0;border-bottom:2px solid var(--line,#e5e7eb)}'
  +'.cs-tab{background:none;border:none;border-bottom:2px solid transparent;margin-bottom:-2px;padding:10px 16px;font:inherit;font-weight:700;font-size:13.5px;color:var(--muted,#6b7280);cursor:pointer}'
  +'.cs-tab:hover{color:inherit}.cs-tab.on{color:var(--accent,#0ea5a5);border-bottom-color:var(--accent,#0ea5a5)}'
  +'.cs-check{display:flex;gap:8px;align-items:center;margin:4px 0 14px;font-size:13.5px}.cs-check input{width:auto}'
  +'.cs-master{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border:1px solid var(--line,#e5e7eb);border-radius:10px;background:var(--surface,#f7f7f9);margin:6px 0 12px}'
  +'.cs-master-btns{display:flex;gap:6px;flex:0 0 auto}'
  +'.cs-listhead{display:flex;gap:8px;margin-bottom:12px}'
  +'.cs-badge.sch{background:#fff4e5;color:#b45309}'
  +'.cs-status.wait{border-color:#d97706;color:#b45309}.cs-status.ok{border-color:#1a7f4b;color:#1a7f4b}.cs-status.err{border-color:#c0392b;color:#c0392b}'
  /* CARDS + STEPS */
  +'.cs-card{background:var(--surface,#fff);border:1px solid var(--line,#e5e7eb);border-radius:16px;padding:20px 20px;margin:14px 0;box-shadow:0 1px 2px rgba(0,0,0,.03)}'
  +'.cs-step{display:flex;align-items:center;gap:10px;margin:0 0 14px}.cs-step h3{margin:0;font-size:16px}'
  +'.cs-step-n{width:26px;height:26px;border-radius:50%;background:var(--accent,#0ea5a5);color:var(--on-accent,#fff);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;flex:0 0 auto}'
  +'.cs-step .cs-wc{margin-left:auto}'
  +'.cs-f{margin:0 0 12px}.cs-f label{display:block;font-size:12.5px;font-weight:600;margin:0 0 5px}'
  +'.cs-f input,.cs-f select,.cs-f textarea{width:100%;padding:10px 12px;border:1px solid var(--line,#e5e7eb);border-radius:10px;font:inherit;background:var(--bg,#fff);color:inherit;box-sizing:border-box}'
  +'.cs-f input:focus,.cs-f select:focus,.cs-f textarea:focus{outline:none;border-color:var(--accent,#0ea5a5);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent,#0ea5a5) 18%,transparent)}'
  +'.cs-f textarea{resize:vertical;line-height:1.6}'
  +'.cs-grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px}.cs-grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}'
  /* EDITOR 2-COL */
  +'.cs-edit{display:grid;grid-template-columns:1.4fr 1fr;gap:18px}'
  +'.cs-btn{padding:10px 16px;border:1px solid var(--line,#e5e7eb);border-radius:10px;background:var(--bg,#fff);color:inherit;cursor:pointer;font:inherit;font-weight:600;transition:filter .15s}'
  +'.cs-btn:hover{filter:brightness(.97)}.cs-btn.pri{background:var(--accent,#0ea5a5);color:var(--on-accent,#fff);border-color:transparent}.cs-btn.lg{padding:13px 24px;font-size:15px}'
  +'.cs-actions{display:flex;gap:10px;margin-top:8px;flex-wrap:wrap}'
  +'.cs-sticky{border-top:1px solid var(--line,#eee);margin-top:16px;padding-top:14px}'
  +'.cs-wc{font-size:12.5px;color:var(--muted,#6b7280)}'
  /* COVER + IMAGES */
  +'.cs-grid-img{display:grid;grid-template-columns:1fr auto;gap:8px;margin-top:8px}'
  +'.cs-cover{border:1px dashed var(--line,#e5e7eb);border-radius:12px;min-height:150px;display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative;background:var(--bg,#fafafa)}'
  +'.cs-cover img{width:100%;height:180px;object-fit:cover;display:block}'
  +'.cs-credit{position:absolute;bottom:6px;right:8px;background:rgba(0,0,0,.6);color:#fff;font-size:11px;padding:2px 7px;border-radius:6px}'
  +'.cs-img-results{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}'
  +'.cs-img{padding:0;border:2px solid transparent;border-radius:8px;overflow:hidden;cursor:pointer;background:none;aspect-ratio:4/3}'
  +'.cs-img img{width:100%;height:100%;object-fit:cover;display:block}.cs-img.sel{border-color:var(--accent,#0ea5a5)}'
  /* LIST */
  +'.cs-row{display:flex;gap:12px;align-items:center;padding:10px;border:1px solid var(--line,#eee);border-radius:12px;margin-bottom:8px}'
  +'.cs-row-img{width:60px;height:60px;border-radius:9px;overflow:hidden;flex:0 0 auto;display:flex;align-items:center;justify-content:center;background:var(--bg,#f3f4f6);font-size:24px}'
  +'.cs-row-img img{width:100%;height:100%;object-fit:cover}'
  +'.cs-row-main{flex:1;min-width:0}.cs-row-main b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
  +'.cs-row-sub{font-size:12px;color:var(--muted,#6b7280);margin-top:3px}'
  +'.cs-badge{padding:1px 8px;border-radius:999px;font-size:11px;font-weight:700}.cs-badge.pub{background:#e6f6ee;color:#1a7f4b}.cs-badge.draft{background:#fdecec;color:#c0392b}.cs-badge.ai{background:#eef2ff;color:#4f46e5}'
  +'.cs-row-act button{background:none;border:1px solid var(--line,#e5e7eb);border-radius:8px;padding:6px 10px;cursor:pointer;margin-left:5px}'
  /* SETTINGS */
  +'.cs-settings summary{cursor:pointer;font-weight:700;font-size:15px;padding:2px 0}'
  +'.cs-settings[open]>summary{margin-bottom:12px}'
  +'.cs-provcard{border:1px solid var(--line,#e5e7eb);border-radius:12px;padding:12px 14px;margin:0 0 10px;background:var(--bg,#fafafa)}'
  +'.cs-provcard.cs-prox{border-color:var(--accent,#0ea5a5);background:color-mix(in srgb,var(--accent,#0ea5a5) 6%,transparent)}'
  +'.cs-provcard-h{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;margin:0 0 8px}.cs-provcard-h b{font-size:14px}'
  +'.cs-provcard input{width:100%;padding:9px 11px;border:1px solid var(--line,#e5e7eb);border-radius:9px;font:inherit;background:var(--surface,#fff);color:inherit;box-sizing:border-box}'
  +'.cs-quota{display:flex;align-items:center;gap:8px;margin-top:8px}'
  +'.cs-quota-bar{flex:1;height:7px;border-radius:99px;background:var(--line,#e5e7eb);overflow:hidden}.cs-quota-bar span{display:block;height:100%;background:var(--accent,#0ea5a5)}'
  /* IMAGE BUTTONS + BODY TOOLBAR + PREVIEW */
  +'.cs-imgbtns{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}'
  +'.cs-upl{cursor:pointer;display:inline-flex;align-items:center}'
  +'.cs-toolbar{display:flex;gap:4px;flex-wrap:wrap;align-items:center;padding:6px;border:1px solid var(--line,#e5e7eb);border-bottom:none;border-radius:10px 10px 0 0;background:var(--bg,#fafafa)}'
  +'.cs-toolbar button,.cs-tb-upl{background:var(--surface,#fff);border:1px solid var(--line,#e5e7eb);border-radius:7px;padding:5px 9px;cursor:pointer;font:inherit;font-size:12.5px;line-height:1;color:inherit}'
  +'.cs-toolbar button:hover,.cs-tb-upl:hover{border-color:var(--accent,#0ea5a5)}'
  +'.cs-tb-upl{display:inline-flex;align-items:center}.cs-tb-r{margin-left:auto}'
  +'.cs-toolbar + textarea{border-radius:0 0 10px 10px}'
  +'.cs-preview{border:1px solid var(--line,#e5e7eb);border-radius:0 0 10px 10px;padding:16px;background:var(--bg,#fff);max-height:420px;overflow:auto}'
  +'.cs-article h2{font-size:20px;margin:18px 0 8px}.cs-article h3{font-size:16px;margin:14px 0 6px}.cs-article p{margin:0 0 12px;line-height:1.7}.cs-article ul{margin:0 0 12px;padding-left:20px}.cs-article li{margin:2px 0}'
  +'.cs-article img{max-width:100%;border-radius:10px}.cs-article blockquote{margin:12px 0;padding:8px 14px;border-left:3px solid var(--accent,#0ea5a5);background:var(--surface,#f7f7f7);border-radius:0 8px 8px 0}.cs-article a{color:var(--accent,#0ea5a5)}'
  /* BLOK EDİTÖRÜ */
  +'.cs-blocks{display:flex;flex-direction:column;gap:8px}'
  +'.cs-blk{border:1px solid var(--line,#e5e7eb);border-radius:10px;background:var(--bg,#fff);overflow:hidden}'
  +'.cs-blk-ctrl{display:flex;align-items:center;justify-content:space-between;padding:4px 8px;background:var(--surface,#f7f7f9);border-bottom:1px solid var(--line,#eee)}'
  +'.cs-blk-t{font-size:11px;font-weight:700;color:var(--muted,#6b7280)}'
  +'.cs-blk-btns button{background:none;border:1px solid var(--line,#e5e7eb);border-radius:6px;padding:2px 7px;cursor:pointer;margin-left:4px;font-size:12px}'
  +'.cs-blk-body{padding:10px 12px}'
  +'.cs-ce{min-height:26px;outline:none;line-height:1.65;font-size:15px}.cs-ce:empty:before{content:attr(data-ph);color:var(--muted,#9ca3af)}'
  +'.cs-ce-h{font-size:19px;font-weight:700}'
  +'.cs-hrow{display:flex;gap:8px;align-items:flex-start}.cs-hrow select{width:64px;flex:0 0 auto;padding:6px;border:1px solid var(--line,#e5e7eb);border-radius:8px}'
  +'.cs-cap{width:100%;margin-top:6px;padding:7px 10px;border:1px solid var(--line,#e5e7eb);border-radius:8px;font:inherit;font-size:13px;box-sizing:border-box;background:var(--surface,#fff);color:inherit}'
  +'.cs-blk-cover{border:1px dashed var(--line,#e5e7eb);border-radius:8px;min-height:90px;display:flex;align-items:center;justify-content:center;overflow:hidden;background:var(--surface,#fafafa);margin-bottom:6px}.cs-blk-cover img{width:100%;max-height:220px;object-fit:cover;display:block}'
  +'.cs-hr{text-align:center;color:var(--muted,#9ca3af);letter-spacing:4px}'
  +'.cs-addbar{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:10px;padding-top:10px;border-top:1px dashed var(--line,#e5e7eb)}'
  +'.cs-addbar button{background:var(--surface,#fff);border:1px solid var(--line,#e5e7eb);border-radius:8px;padding:6px 11px;cursor:pointer;font:inherit;font-size:12.5px;font-weight:600}'
  +'.cs-addbar button:hover{border-color:var(--accent,#0ea5a5)}'
  /* GALERİ editör + public */
  +'.cs-gal-edit{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}'
  +'.cs-gal-cell{border:1px solid var(--line,#eee);border-radius:8px;padding:6px}'
  +'.cs-gal-thumb{position:relative;aspect-ratio:4/3;border-radius:6px;overflow:hidden;background:var(--surface,#f3f4f6);display:flex;align-items:center;justify-content:center}'
  +'.cs-gal-thumb img{width:100%;height:100%;object-fit:cover}'
  +'.cs-gal-x{position:absolute;top:3px;right:3px;background:rgba(0,0,0,.6);color:#fff;border:none;border-radius:50%;width:22px;height:22px;cursor:pointer;font-size:14px;line-height:1}'
  +'.cs-gal-add{margin-top:8px}'
  +'.cs-gal{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin:12px 0}.cs-gal>figure{margin:0}.cs-gal img{width:100%;border-radius:10px;display:block}.cs-gal figcaption{font-size:12px;color:var(--muted,#6b7280);margin-top:4px}.cs-gal-cap{grid-column:1/-1;text-align:center;font-size:12.5px;color:var(--muted,#6b7280)}'
  /* VİDEO (responsive 16:9) — editör önizleme + public */
  +'.cs-video{margin:14px 0}.cs-video-frame{position:relative;width:100%;aspect-ratio:16/9;border-radius:12px;overflow:hidden;background:#000}.cs-video figcaption{font-size:12.5px;color:var(--muted,#6b7280);margin-top:6px;text-align:center}'
  +'.cs-video-prev{margin-top:8px}.cs-video-prev .cs-video{margin:0}'
  +'@media(max-width:720px){.cs-edit{grid-template-columns:1fr}.cs-grid2,.cs-grid3{grid-template-columns:1fr}.cs-img-results{grid-template-columns:repeat(3,1fr)}.cs-gal-edit{grid-template-columns:repeat(2,1fr)}}';
})();
