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

  /* ---------- ÜRETİM ---------- */
  CS.generate = async function(){
    var topic=($('cs_topic')||{}).value||''; topic=topic.trim();
    if(!topic){toast('Lütfen bir konu/başlık girin.');return;}
    var o={topic:topic,keywords:(($('cs_kw')||{}).value||'').trim(),tone:(($('cs_tone')||{}).value||'bilgilendirici'),lang:(($('cs_lang')||{}).value||'tr'),minWords:parseInt(($('cs_len')||{}).value||'600',10)||600};
    var btn=$('cs_genBtn'); if(btn){btn._t=btn.textContent;btn.disabled=true;btn.textContent='✍️ Üretiliyor…';}
    _status('YZ makaleyi yazıyor… (sağlayıcı: '+_provLabel()+')','wait');
    var text=null,err=null;
    try{ var r=await CFG.ai({persona:'office',tool:'blog',prompt:buildPrompt(o)}); text=r&&(r.answer||r.text||(r.data&&(r.data.answer||r.data.text))); if(r&&r.fallback)text=null; }
    catch(e){err=e;}
    if(!text){ if(btn){btn.disabled=false;btn.textContent=btn._t;}
      var hint=_hasAnyKey()?'Seçili sağlayıcıya ulaşılamadı — anahtarı "Kaydet & Test Et" ile doğrulayın (ProX yerelde CORS nedeniyle çalışmayabilir).':'Önce bir anahtar girin: aşağıda ⚙️ Ayarlar → ProX / DeepSeek / OpenAI / Claude.';
      _status('YZ yanıt vermedi. '+hint,'err');
      var d=$('cs_set'); if(d&&!_hasAnyKey()){d.open=true;} return; }
    var g=parseOut(text);
    if(!g.body){ g.body=_cleanBody(text); if(!g.title)g.title=topic; }
    g.body=_cleanBody(g.body);/* model başlık satırlarını (BASLIK:..) yanlışlıkla gövdeye kattıysa temizle */
    var wc=wordCount(g.body);
    /* ≥ hedef kelime kontrolü — kısa ise otomatik genişlet (tek deneme) */
    if(wc<o.minWords){
      _status('Makale kısa ('+wc+' kelime) — hedefe ('+o.minWords+') genişletiliyor…','wait');
      try{
        var ep='Aşağıdaki makaleyi, aynı konu ve üslupta, EN AZ '+o.minWords+' kelimeye çıkacak şekilde GENİŞLET (yeni ## alt başlıklar, örnekler, detaylar ekle). Sadece genişletilmiş Markdown gövdeyi döndür (BASLIK/KATEGORI gibi etiket satırı EKLEME):\n\n'+g.body;
        var r2=await CFG.ai({persona:'office',tool:'blog',prompt:(CFG.guard?CFG.guard(ep):ep)});
        var t2=r2&&(r2.answer||r2.text||(r2.data&&(r2.data.answer||r2.data.text)));
        t2=_cleanBody(t2);
        if(t2&&wordCount(t2)>wc){g.body=t2;wc=wordCount(g.body);}
      }catch(e){}
    }
    DRAFT={
      id:DRAFT&&DRAFT.id||Date.now(),
      title:g.title||topic, slug:slugify(g.title||topic), cat:g.cat||'Genel',
      tags:(g.tags||'').split(/[,;]/).map(function(s){return s.trim();}).filter(Boolean).slice(0,8),
      sum:g.sum||'', body:g.body||'', imgq:g.imgq||topic,
      img:null, seo:{title:(g.title||topic).slice(0,60),desc:(g.sum||'').slice(0,160)},
      status:'draft', date:today(), words:wc, src:'ai', icon:'📝'
    };
    _fillEditor(DRAFT);
    if(btn){btn.disabled=false;btn.textContent=btn._t;}
    _status('✓ Makale üretildi ('+wc+' kelime'+(wc>=o.minWords?', hedef tamam':', hedefin altında')+'). Görsel aranıyor…','ok');
    CS.findImage(DRAFT.imgq);
  };

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
    DRAFT.img={url:p.url,alt:p.alt||DRAFT.title,credit:p.credit,creditUrl:p.creditUrl};
    var prev=$('cs_coverPrev'); if(prev)prev.innerHTML='<img src="'+esc(p.url)+'" alt="'+esc(p.alt)+'"><span class="cs-credit">📷 '+esc(p.credit)+' · Pexels</span>';
    [].forEach.call(document.querySelectorAll('#cs_imgResults .cs-img'),function(b,bi){b.classList.toggle('sel',bi===i);});
  };

  /* ---------- EDİTÖR ↔ DRAFT ---------- */
  function _fillEditor(a){
    if($('cs_title'))$('cs_title').value=a.title||'';
    if($('cs_slug'))$('cs_slug').value=a.slug||'';
    if($('cs_cat'))$('cs_cat').value=a.cat||'';
    if($('cs_tags'))$('cs_tags').value=(a.tags||[]).join(', ');
    if($('cs_sum'))$('cs_sum').value=a.sum||'';
    if($('cs_body'))$('cs_body').value=a.body||'';
    if($('cs_seoTitle'))$('cs_seoTitle').value=(a.seo&&a.seo.title)||'';
    if($('cs_seoDesc'))$('cs_seoDesc').value=(a.seo&&a.seo.desc)||'';
    if($('cs_imgq'))$('cs_imgq').value=a.imgq||'';
    var prev=$('cs_coverPrev');
    if(prev)prev.innerHTML=a.img?('<img src="'+esc(a.img.url)+'" alt="'+esc(a.img.alt||'')+'"><span class="cs-credit">📷 '+esc(a.img.credit||'')+' · Pexels</span>'):'<div class="cs-muted">Kapak görseli yok</div>';
    _syncMeta();
  }
  function _collect(){
    if(!DRAFT)DRAFT={id:Date.now(),src:'firma',date:today(),icon:'📝'};
    DRAFT.title=($('cs_title')||{}).value||''; DRAFT.slug=(($('cs_slug')||{}).value||slugify(DRAFT.title)).trim();
    DRAFT.cat=($('cs_cat')||{}).value||'Genel';
    DRAFT.tags=(($('cs_tags')||{}).value||'').split(/[,;]/).map(function(s){return s.trim();}).filter(Boolean);
    DRAFT.sum=($('cs_sum')||{}).value||'';
    DRAFT.body=($('cs_body')||{}).value||'';
    DRAFT.seo={title:(($('cs_seoTitle')||{}).value||DRAFT.title).slice(0,60),desc:(($('cs_seoDesc')||{}).value||DRAFT.sum).slice(0,160)};
    DRAFT.imgq=($('cs_imgq')||{}).value||DRAFT.imgq||'';
    DRAFT.words=wordCount(DRAFT.body);
    return DRAFT;
  }
  function _syncMeta(){
    var w=wordCount(($('cs_body')||{}).value||''); var el=$('cs_wc');
    if(el){var ok=w>=600;el.innerHTML='<b style="color:'+(ok?'#1a7f4b':'#c0392b')+'">'+w+' kelime</b> · '+readingTime(w)+' · '+(ok?'✓ SEO uzunluğu yeterli':'≥600 kelime önerilir');}
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

  CS.renderList = function(){
    var host=$('cs_list'); if(!host)return; var arts=(CFG.list&&CFG.list())||[];
    if(!arts.length){host.innerHTML='<div class="cs-muted" style="padding:16px">Henüz makale yok. Yukarıdan üretin veya "Yeni".</div>';return;}
    host.innerHTML=arts.map(function(a){
      return '<div class="cs-row">'
        +'<div class="cs-row-img">'+(a.img&&a.img.url?'<img src="'+esc(a.img.url)+'" alt="">':'<span>'+(a.icon||'📝')+'</span>')+'</div>'
        +'<div class="cs-row-main"><b>'+esc(a.title||'—')+'</b>'
        +'<div class="cs-row-sub">'+esc(a.cat||'Genel')+' · '+(a.words||wordCount(a.body))+' kelime · '+esc(a.date||'')
        +' · <span class="cs-badge '+(a.status==='published'?'pub':'draft')+'">'+(a.status==='published'?'Yayında':'Taslak')+'</span>'
        +(a.src==='ai'?' · <span class="cs-badge ai">YZ</span>':'')+'</div></div>'
        +'<div class="cs-row-act"><button type="button" onclick="ContentStudio.edit('+a.id+')">✎</button>'
        +'<button type="button" onclick="ContentStudio.del('+a.id+')">🗑</button></div></div>';
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

  function _html(k){
    var prov=k.provider||'auto';
    var noKey=!(k.proxKey||k.dsKey||k.oaKey||k.clKey);
    var q=(CFG.proxInfo&&CFG.proxInfo())||null;
    return ''
    +'<div class="cs-wrap">'
    /* HERO */
    +'<div class="cs-hero"><div class="cs-hero-ic">✨</div><div><h2>İçerik Stüdyosu</h2>'
      +'<p>SEO uyumlu, ProX destekli makaleler üretin — konuya uygun gerçek görselle birlikte <b>/blog</b>\'da yayınlayın.</p></div></div>'
    /* SAĞLAYICI CHIP\'LERİ */
    +'<div class="cs-provbar"><span class="cs-provbar-l">Yapay zekâ:</span><div class="cs-chips" id="cs_provChips"></div>'
      +'<button type="button" class="cs-link" onclick="var d=document.getElementById(\'cs_set\');if(d){d.open=true;d.scrollIntoView({behavior:\'smooth\'});}">⚙️ Anahtarlar & Ayarlar</button></div>'
    +'<div class="cs-status" id="cs_status">'+(noKey?'⚠️ Henüz sağlayıcı anahtarı yok — <b>Anahtarlar & Ayarlar</b>\'dan ProX / DeepSeek / OpenAI / Claude anahtarı girin.':'Aktif sağlayıcı: '+esc(({auto:'Otomatik',prox:'ProX',deepseek:'DeepSeek',openai:'OpenAI',claude:'Claude'})[prov]||prov))+'</div>'
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
          +'<div class="cs-f"><label>Gövde <span class="cs-muted">(Markdown — ## alt başlık)</span></label><textarea id="cs_body" rows="16" placeholder="Makale gövdesi burada oluşur…"></textarea></div>'
        +'</div>'
        +'<div class="cs-edit-side">'
          +'<div class="cs-f"><label>Kapak görseli</label><div class="cs-cover" id="cs_coverPrev"><div class="cs-muted">Kapak görseli yok</div></div>'
            +'<div class="cs-grid-img"><input id="cs_imgq" placeholder="görsel ara (ör. modern apartment)"><button type="button" class="cs-btn" onclick="ContentStudio.findImage()">🔎</button></div>'
            +'<div class="cs-img-results" id="cs_imgResults"></div></div>'
          +'<div class="cs-f"><label>Özet <span class="cs-muted">(meta)</span></label><textarea id="cs_sum" rows="3"></textarea></div>'
          +'<div class="cs-f"><label>SEO başlık</label><input id="cs_seoTitle" maxlength="70"></div>'
          +'<div class="cs-f"><label>SEO açıklama</label><input id="cs_seoDesc" maxlength="160"></div>'
        +'</div>'
      +'</div>'
      +'<div class="cs-actions cs-sticky"><button type="button" class="cs-btn pri" onclick="ContentStudio.save(true)">✓ Kaydet &amp; Yayınla</button>'
      +'<button type="button" class="cs-btn" onclick="ContentStudio.save(false)">Taslak kaydet</button></div>'
    +'</div>'
    /* MAKALELER */
    +'<div class="cs-card"><div class="cs-step"><span class="cs-step-n">3</span><h3>Makaleler</h3></div><div id="cs_list"></div></div>'
    /* AYARLAR */
    +'<details class="cs-card cs-settings" id="cs_set"'+(noKey?' open':'')+'><summary>⚙️ Yapay Zekâ &amp; Görsel Ayarları</summary>'
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
    +'</details>'
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
  /* Markdown → HTML (hafif; başlık/kalın/liste/paragraf) — public render için */
  CS.mdToHtml = function(md){
    md=''+(md||'');
    var esc2=function(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');};
    var lines=md.split(/\n/),out=[],inUl=false;
    lines.forEach(function(ln){
      var t=ln.trim();
      if(/^###\s+/.test(t)){if(inUl){out.push('</ul>');inUl=false;}out.push('<h3>'+esc2(t.replace(/^###\s+/,''))+'</h3>');return;}
      if(/^##\s+/.test(t)){if(inUl){out.push('</ul>');inUl=false;}out.push('<h2>'+esc2(t.replace(/^##\s+/,''))+'</h2>');return;}
      if(/^[-*]\s+/.test(t)){if(!inUl){out.push('<ul>');inUl=true;}out.push('<li>'+esc2(t.replace(/^[-*]\s+/,'')).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>')+'</li>');return;}
      if(!t){if(inUl){out.push('</ul>');inUl=false;}return;}
      if(inUl){out.push('</ul>');inUl=false;}
      out.push('<p>'+esc2(t).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>')+'</p>');
    });
    if(inUl)out.push('</ul>');
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
  +'@media(max-width:720px){.cs-edit{grid-template-columns:1fr}.cs-grid2,.cs-grid3{grid-template-columns:1fr}.cs-img-results{grid-template-columns:repeat(3,1fr)}}';
})();
