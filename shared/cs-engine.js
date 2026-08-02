/* ===================================================================
   cs-engine.js — ORTAK YZ MOTORU (çok-örnekli / multi-instance)
   İki BAĞIMSIZ ajan için kullanılır (her biri kendi anahtar deposu):
     • İçerik Ajanı  (admin makale/haber üretimi — content-studio.js)
     • Site Asistanı (ziyaretçi sohbeti — public chat)
   Kendine-yeten: çok-sağlayıcı YZ (ProX+DeepSeek+OpenAI+Claude),
   Openverse/Pexels görsel. Site proxApi/EMLAK_TENANT'a BAĞIMSIZ.

   KURULUM — her ajan için ayrı örnek:
     var content = CSEngine.create({ store:'dn_cs_content', tenantId:'consultant' });
     var site    = CSEngine.create({ store:'dn_cs_site',    tenantId:'consultant' });
   content-studio.js cfg'sinde content örneğini kullanın:
     ai:function(b){return content.ai(b,{max_tokens:3500,timeout:70000});}, ...
   Site sohbetinde:
     var sys = CSEngine.assistantPrompt({brand:..,city:..,lang:..,caps:..,prompt:..,portfolio:..});
     site.ai({ prompt:sys, messages:[...] });

   Geriye dönük: CSEngine.init(o) varsayılan tekil örneği yapılandırır.
   =================================================================== */
(function(){
  var DEF={ store:'cs_aicfg', tenantId:'', proxBase:'https://www.emlakekspertizi.com' };

  function _ctrl(opts){ var c=(typeof AbortController!=='undefined')?new AbortController():null; var t=c?setTimeout(function(){try{c.abort();}catch(e){}},(opts&&opts.timeout)||60000):null; return {c:c,t:t}; }
  function _msgs(body){
    body=body||{};
    var SYS='Sen profesyonel bir Türk emlak/gayrimenkul içerik yapay zekasısın. Türkçe ve net yaz; yalnızca doğrulanabilir bilgi ver; kesin fiyat/garanti getiri UYDURMA.';
    if((Array.isArray(body.messages)&&body.messages.length)||body.message!=null){
      var msgs=[{role:'system',content:body.prompt||SYS}];
      if(Array.isArray(body.messages)&&body.messages.length){ body.messages.forEach(function(m){ if(m&&m.content)msgs.push({role:(m.role==='assistant'?'assistant':(m.role==='system'?'system':'user')),content:String(m.content)}); }); }
      else msgs.push({role:'user',content:String(body.message)});
      return msgs;
    }
    return [{role:'system',content:body.prompt||SYS},{role:'user',content:String(body.prompt?' ':(body.message||''))}];
  }

  /* ---- tek bir bağımsız motor örneği ---- */
  function make(opts){
    var E={ cfg:{} };
    for(var d in DEF)E.cfg[d]=DEF[d];
    if(opts)for(var k in opts){ if(opts[k]!=null)E.cfg[k]=opts[k]; }
    E.init=function(o){ o=o||{}; for(var k in o){ if(o[k]!=null)E.cfg[k]=o[k]; } return E; };

    E._get=function(){ try{ return JSON.parse(localStorage.getItem(E.cfg.store)||'{}')||{}; }catch(e){ return {}; } };
    E._set=function(a){ try{ localStorage.setItem(E.cfg.store,JSON.stringify(a)); }catch(e){} };
    E.getKeys=function(){ var a=E._get(); return {provider:a.provider||'auto',proxKey:a.proxKey||'',dsKey:a.dsKey||'',dsModel:a.dsModel||'deepseek-chat',oaKey:a.oaKey||'',oaModel:a.oaModel||'gpt-4o-mini',clKey:a.clKey||'',clModel:a.clModel||'claude-sonnet-4-6',pexelsKey:a.pexelsKey||'',prompt:a.prompt||'',sysPrompt:(a.sysPrompt!=null?a.sysPrompt:(a.prompt||'')),schedule:a.schedule||null,capabilities:a.capabilities||null}; };
    E.setKeys=function(k){ var a=E._get(); ['provider','proxKey','dsKey','dsModel','oaKey','oaModel','clKey','clModel','pexelsKey','prompt','sysPrompt','capabilities'].forEach(function(f){ if(k[f]!==undefined)a[f]=k[f]; }); E._set(a); };
    E.getSchedule=function(){ return E._get().schedule||{}; };
    E.setSchedule=function(s){ var a=E._get(); a.schedule=s; E._set(a); };
    E.getPrompt=function(){ return ((E._get().prompt||'')+'').trim(); };
    E.getCaps=function(){ var c=E._get().capabilities; return c||{}; };
    E.sysPrompt=function(){ var a=E._get(); return (((a.sysPrompt!=null?a.sysPrompt:a.prompt)||'')+'').trim(); };
    E.proxInfo=function(){ try{ var q=JSON.parse(localStorage.getItem(E.cfg.store+'_quota')||'{}'); return {count:q.count||0,max:10000}; }catch(e){ return {count:0,max:10000}; } };
    E.hasAnyKey=function(){ var k=E.getKeys(); return !!(k.proxKey||k.dsKey||k.oaKey||k.clKey); };
    E._bumpQuota=function(){ try{ var qm=new Date().toISOString().slice(0,7),k=E.cfg.store+'_quota',q=JSON.parse(localStorage.getItem(k)||'null'); if(!q||q.month!==qm)q={month:qm,count:0}; q.count++; localStorage.setItem(k,JSON.stringify(q)); }catch(e){} };

    E._deepseek=async function(body,opts){ opts=opts||{}; var k=E.getKeys(); if(!k.dsKey)return null; var x=_ctrl(opts);
      try{ var r=await fetch('https://api.deepseek.com/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+k.dsKey},body:JSON.stringify({model:k.dsModel,messages:_msgs(body),temperature:(opts.temperature!=null?opts.temperature:0.7),max_tokens:(opts.max_tokens||3000),stream:false}),signal:x.c?x.c.signal:undefined});
        if(x.t)clearTimeout(x.t); if(!r.ok)return {_err:true,status:r.status}; var j=await r.json(); var t=j&&j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content; return (t&&t.trim())?{answer:t.trim(),_via:'deepseek'}:{_err:true}; }
      catch(e){ if(x.t)clearTimeout(x.t); return {_err:true,err:''+e}; } };
    E._openai=async function(body,opts){ opts=opts||{}; var k=E.getKeys(); if(!k.oaKey)return null; var x=_ctrl(opts);
      try{ var r=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+k.oaKey},body:JSON.stringify({model:k.oaModel,messages:_msgs(body),temperature:(opts.temperature!=null?opts.temperature:0.7),max_tokens:(opts.max_tokens||3000)}),signal:x.c?x.c.signal:undefined});
        if(x.t)clearTimeout(x.t); if(!r.ok)return {_err:true,status:r.status}; var j=await r.json(); var t=j&&j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content; return (t&&t.trim())?{answer:t.trim(),_via:'openai'}:{_err:true}; }
      catch(e){ if(x.t)clearTimeout(x.t); return {_err:true,err:''+e}; } };
    E._claude=async function(body,opts){ opts=opts||{}; var k=E.getKeys(); if(!k.clKey)return null; var m=_msgs(body);
      var sys=m.filter(function(x){return x.role==='system';}).map(function(x){return x.content;}).join('\n');
      var conv=m.filter(function(x){return x.role!=='system';}).map(function(x){return {role:(x.role==='assistant'?'assistant':'user'),content:String(x.content)};}); if(!conv.length)conv=[{role:'user',content:String(body.prompt||body.message||'')}];
      var x=_ctrl(opts);
      try{ var r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':k.clKey,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify({model:k.clModel,max_tokens:(opts.max_tokens||3000),system:sys||undefined,messages:conv}),signal:x.c?x.c.signal:undefined});
        if(x.t)clearTimeout(x.t); if(!r.ok)return {_err:true,status:r.status}; var j=await r.json(); var t=j&&j.content&&j.content[0]&&(j.content[0].text||''); return (t&&t.trim())?{answer:t.trim(),_via:'claude'}:{_err:true}; }
      catch(e){ if(x.t)clearTimeout(x.t); return {_err:true,err:''+e}; } };
    E._prox=async function(body,opts){ opts=opts||{}; var k=E.getKeys(); if(!k.proxKey)return {fallback:true}; var x=_ctrl(opts);
      try{ var r=await fetch(E.cfg.proxBase+'/api/v1/tenant/prox/ai',{method:'POST',mode:'cors',headers:{'Content-Type':'application/json','X-Tenant-Id':E.cfg.tenantId,'X-Tenant-Key':k.proxKey},body:JSON.stringify(body),signal:x.c?x.c.signal:undefined});
        if(x.t)clearTimeout(x.t); if(!r.ok)return {fallback:true,status:r.status}; E._bumpQuota(); var j=await r.json(); return j; }
      catch(e){ if(x.t)clearTimeout(x.t); return {fallback:true,err:''+e}; } };

    E.ai=async function(body,opts){ var k=E.getKeys(); var p=k.provider||'auto'; var r;
      if(p==='deepseek'&&k.dsKey){ r=await E._deepseek(body,opts); if(r&&r.answer)return r; }
      else if(p==='openai'&&k.oaKey){ r=await E._openai(body,opts); if(r&&r.answer)return r; }
      else if(p==='claude'&&k.clKey){ r=await E._claude(body,opts); if(r&&r.answer)return r; }
      else if(p==='auto'){ if(k.dsKey){r=await E._deepseek(body,opts);if(r&&r.answer)return r;} if(k.oaKey){r=await E._openai(body,opts);if(r&&r.answer)return r;} if(k.clKey){r=await E._claude(body,opts);if(r&&r.answer)return r;} }
      return await E._prox(body,opts); };

    /* Görsel: Pexels(anahtar) → Openverse(anahtarsız, CC, aşamalı sadeleştirme) */
    E.image=async function(q){ q=(''+(q||'')).trim(); if(!q)return null; var k=E.getKeys();
      if(k.pexelsKey){ try{ var r=await fetch('https://api.pexels.com/v1/search?per_page=12&orientation=landscape&locale=tr-TR&query='+encodeURIComponent(q),{headers:{'Authorization':k.pexelsKey}}); if(r.ok){ var j=await r.json(); var ph=(j&&j.photos)||[]; if(ph.length)return ph.map(function(p){var s=p.src||{};return {url:s.large||s.original||s.medium,thumb:s.medium||s.small||s.tiny,alt:p.alt||q,credit:(p.photographer||'')+' · Pexels',creditUrl:p.photographer_url||'https://www.pexels.com'};}); } }catch(e){} }
      var _ov=async function(qq){ try{ var r=await fetch('https://api.openverse.org/v1/images/?q='+encodeURIComponent(qq)+'&page_size=12',{headers:{'Accept':'application/json'}}); if(!r.ok)return null; var j=await r.json(); var rs=(j&&j.results)||[]; if(!rs.length)return null; return rs.filter(function(p){return p.url;}).map(function(p){return {url:p.url,thumb:p.thumbnail||p.url,alt:p.title||qq,credit:(p.creator||'Openverse')+' · Openverse',creditUrl:p.creator_url||p.foreign_landing_url||'https://openverse.org'};}); }catch(e){ return null; } };
      var TR=/[çğıöşüİ]/i; var words=q.split(/\s+/).filter(function(w){return w.length>2&&!TR.test(w);});
      var cands=[]; if(words.length)cands.push(words.slice(0,2).join(' ')); if(words.length)cands.push(words[0]); cands.push('modern apartment'); cands.push('real estate'); cands.push('city building');
      for(var i=0;i<cands.length;i++){ var got=await _ov(cands[i]); if(got&&got.length)return got; }
      return {_err:true,status:0};
    };

    /* Site Asistanı tek-çağrı yanıtı: sistem-promptu derler + geçmişle sorar + telefon yakalarsa lead düşer */
    E.reply=async function(ctx){ ctx=ctx||{};
      var stored=E.getCaps(); var caps=(stored&&Object.keys(stored).length)?stored:(ctx.caps||{});
      var sys=API.assistantPrompt({brand:ctx.brand,city:ctx.city,lang:ctx.lang,caps:caps,prompt:(ctx.prompt!=null?ctx.prompt:E.sysPrompt()),portfolio:ctx.portfolio,role:ctx.role});
      var body={prompt:sys};
      if(ctx.history&&ctx.history.length){ var msgs=ctx.history.slice(); msgs.push({role:'user',content:String(ctx.message||'')}); body.messages=msgs; }
      else body.message=String(ctx.message||'');
      var r; try{ r=await E.ai(body,{max_tokens:ctx.max_tokens||900,timeout:ctx.timeout||60000,temperature:(ctx.temperature!=null?ctx.temperature:0.6)}); }catch(e){ r=null; }
      var ans=r&&(r.answer||r.text||(r.data&&(r.data.answer||r.data.text))); if(r&&r.fallback)ans=null;
      if(caps.phone&&ctx.onLead){ var ph=API.extractPhone(ctx.message||''); if(ph){ try{ ctx.onLead({phone:ph,message:String(ctx.message||'')}); }catch(e){} } }
      return { answer:(ans&&(''+ans).trim())||'', ok:!!(ans&&(''+ans).trim()), _via:r&&r._via, fallback:!ans };
    };
    return E;
  }

  /* ---- API: varsayılan tekil örnek + create() fabrikası + assistantPrompt yardımcısı ---- */
  var API=make({});
  API.create=function(o){ return make(o); };

  /* Site Asistanı sistem-promptu — yeteneklere göre derlenir (tüm sitelerde ortak) */
  var LANGN={tr:'Türkçe',en:'İngilizce',ru:'Rusça',zh:'Çince',ar:'Arapça'};
  API.assistantPrompt=function(o){
    o=o||{}; var caps=o.caps||{}; var brand=o.brand||'', city=o.city||'';
    var L=[];
    L.push('Sen '+(brand?('"'+brand+'" markası için '):'')+(o.role||'çalışan, uzman ve güler yüzlü bir gayrimenkul site asistanısın')+'.'+(city?(' Ağırlıklı hizmet bölgen: '+city+'.'):''));
    L.push('Kısa, net ve samimi yanıt ver; ziyaretçiyi bir sonraki adıma (görüşme/analiz) nazikçe yönlendir.');
    if(caps.multilang!==false){ L.push('DİL: Ziyaretçi hangi dilde yazarsa YALNIZCA o dilde yanıt ver'+(o.lang&&LANGN[o.lang]?(' (arayüz dili: '+LANGN[o.lang]+')'):'')+'. Desteklenen diller: Türkçe, İngilizce, Rusça, Çince, Arapça.'); }
    if(caps.advice!==false){ L.push('DANIŞMANLIK: Bölge, süreç ve piyasa hakkında bilgilendirici ol. ANCAK kesin fiyat, rakam veya garanti getiri UYDURMA; sayı gerekiyorsa "güncel ProX verisi/ekspertizle teyit edilmeli" de. Yasal/vergi konusunda kesin hüküm verme, uzmana yönlendir.'); }
    if(caps.match){ L.push('EŞLEŞTİRME: İhtiyaca uygun geldiğinde aşağıdaki güncel portföy/ilan listesinden 1-3 uygun seçeneği kısaca öner. Listede yoksa uydurma; "size özel araştıralım" de.'); }
    if(caps.lead){ L.push('LEAD: Sohbet içinde doğal biçimde ziyaretçinin adını, ihtiyacını (alım/satım/kiralama/değerleme), bütçesini ve ilgilendiği bölgeyi öğrenmeye çalış.'); }
    if(caps.phone){ L.push('TELEFON (ÖNCELİKLİ): Uygun ilk fırsatta, CANLI DANIŞMAN GERİ ARAMASI için ziyaretçinin telefon numarasını nazikçe iste ("Uzman danışmanımızın sizi araması için telefon numaranızı paylaşır mısınız?"). Numara verilirse teşekkür et ve "danışmanımız en kısa sürede sizi arayacak" de. Israrcı olma, en fazla iki kez iste.'); }
    if(o.portfolio){ L.push('\nGÜNCEL PORTFÖY/İLANLAR:\n'+o.portfolio); }
    if(o.prompt){ L.push('\nKURUMA ÖZEL EK TON/KURAL:\n'+o.prompt); }
    return L.join('\n');
  };
  /* Ziyaretçi metninden telefon numarası çıkar (lead yakalama için) */
  API.extractPhone=function(t){ try{ var s=(''+(t||'')); var m=s.match(/(\+?90[\s.\-]?)?0?[\s.\-]?5\d{2}[\s.\-]?\d{3}[\s.\-]?\d{2}[\s.\-]?\d{2}/); if(m)return m[0].replace(/[^\d+]/g,''); var g=s.replace(/\D/g,''); return (g.length>=10)?g.slice(-11):''; }catch(e){ return ''; } };

  window.CSEngine=API;
})();
