/* ============================================================================
   danisman · portfoy-visuals.js — BESPOKE MİMARİ SVG İLLÜSTRASYON KÜTÜPHANESİ
   Emoji YERİNE editöryal mimari elevation sanatı. Zümrüt "golden-hour" zeminde
   krem çizgi + altın aksan. Tek el: paylaşılan defs + 4-katman çizgi ağırlığı
   (yapı 2.4 / detay 1.4 / ince 0.9 / hayalet 1.2) + ortak altın ufuk y=196 +
   3-6 asimetrik altın ışıklı pencere. STATİK (preview'de RAF donsa da kusursuz).
   Kullanım: window.propScene('yali', uid) → <svg> string. 440×290 viewBox.
   ========================================================================== */
(function(){
  var CREAM='#f3efe2', MUT='#a9c5b6', GOLD='#c39b45', GOLDS='#dcc389', GOLDD='#a17e2d';

  function defs(u){return '<defs>'
    +'<linearGradient id="g-glass-'+u+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+CREAM+'" stop-opacity=".14"/><stop offset=".3" stop-color="'+CREAM+'" stop-opacity=".04"/><stop offset=".55" stop-color="#14805a" stop-opacity="0"/><stop offset="1" stop-color="#0a3527" stop-opacity=".12"/></linearGradient>'
    +'<linearGradient id="g-glassS-'+u+'" x1="0" y1="0" x2="1" y2=".4"><stop offset="0" stop-color="#0a3527" stop-opacity=".24"/><stop offset="1" stop-color="#0e5e3e" stop-opacity=".06"/></linearGradient>'
    +'<radialGradient id="g-wash-'+u+'" cx=".5" cy="0" r=".9"><stop offset="0" stop-color="'+GOLD+'" stop-opacity=".11"/><stop offset=".6" stop-color="'+GOLD+'" stop-opacity="0"/></radialGradient>'
    +'<linearGradient id="g-water-'+u+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+GOLDS+'" stop-opacity=".12"/><stop offset="1" stop-color="#0a3527" stop-opacity=".2"/></linearGradient>'
    +'<linearGradient id="g-pool-'+u+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#14805a" stop-opacity=".28"/><stop offset="1" stop-color="'+GOLDS+'" stop-opacity=".16"/></linearGradient>'
    +'<radialGradient id="g-glow-'+u+'" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="'+GOLDS+'" stop-opacity=".5"/><stop offset="1" stop-color="'+GOLDS+'" stop-opacity="0"/></radialGradient>'
    +'<filter id="g-warm-'+u+'" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
    +'<filter id="g-grain-'+u+'"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch" result="n"/><feComponentTransfer in="n"><feFuncA type="linear" slope=".05"/></feComponentTransfer><feColorMatrix type="matrix" values="0 0 0 0 .95 0 0 0 0 .93 0 0 0 0 .85 0 0 0 1 0"/></filter>'
    +'</defs>';}

  function ground(u){return '<rect x="0" y="196" width="440" height="94" fill="url(#g-wash-'+u+')"/>'
    +'<line x1="0" y1="196" x2="440" y2="196" stroke="'+GOLD+'" stroke-width=".9" opacity=".55"/>';}
  function grain(u){return '<rect x="0" y="0" width="440" height="290" filter="url(#g-grain-'+u+')" opacity=".5" style="mix-blend-mode:overlay"/>';}
  /* asimetrik altın ışıklı pencereler */
  function lit(u,arr){return '<g filter="url(#g-warm-'+u+')">'+arr.map(function(w){return '<rect x="'+w[0]+'" y="'+w[1]+'" width="'+(w[2]||13)+'" height="'+(w[3]||18)+'" rx="1" fill="'+GOLDS+'" fill-opacity="'+(w[4]||.9)+'" stroke="'+GOLD+'" stroke-width=".5"/>';}).join('')+'</g>';}
  /* çizgi ağırlık grupları */
  function G(role,inner){var s={bg:'stroke="'+MUT+'" stroke-width="1.2" opacity=".35"',mid:'stroke="'+CREAM+'" stroke-width="1.4" opacity=".9"',fg:'stroke="'+CREAM+'" stroke-width="2.4"'}[role];return '<g '+s+'>'+inner+'</g>';}

  function svg(u,inner,label){return '<svg viewBox="0 0 440 290" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" fill="none" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="'+label+'">'+defs(u)+ground(u)+inner+grain(u)+'</svg>';}

  var SCENES={
    /* ① YALI — simetrik Boğaz köşkü + cumba + iskele + yansıma */
    yali:function(u){
      var body=G('mid','<rect x="96" y="104" width="196" height="92"/>'
        +'<path d="M88 104 L194 66 L300 104 Z"/>'/* geniş çatı */
        +'<line x1="96" y1="150" x2="292" y2="150"/>'/* kat çizgisi */
        /* simetrik pencereler */
        +'<rect x="128" y="116" width="16" height="26"/><rect x="180" y="116" width="16" height="26"/><rect x="244" y="116" width="16" height="26"/>'
        +'<rect x="128" y="160" width="16" height="26"/><rect x="244" y="160" width="16" height="26"/>'
        +'<rect x="180" y="158" width="28" height="38"/>'/* merkez kapı */);
      var fg=G('fg','<path d="M88 104 L194 66 L300 104" stroke="'+GOLD+'" stroke-width="1.1"/>'/* altın saçak */
        /* cumba oriels */
        +'<path d="M108 118 L120 122 L120 172 L108 176 Z"/><path d="M280 118 L268 122 L268 172 L280 176 Z"/>'
        /* iskele + kazıklar */
        +'<line x1="300" y1="196" x2="416" y2="196" stroke="'+GOLD+'" stroke-width="1.1"/>'
        +'<line x1="322" y1="196" x2="322" y2="206" stroke="'+GOLD+'" stroke-width=".9"/><line x1="356" y1="196" x2="356" y2="207" stroke="'+GOLD+'" stroke-width=".9"/><line x1="390" y1="196" x2="390" y2="208" stroke="'+GOLD+'" stroke-width=".9"/>');
      var refl='<g stroke="'+MUT+'" stroke-width="1" opacity=".22"><rect x="96" y="200" width="196" height="52"/><line x1="128" y1="206" x2="128" y2="228"/><line x1="252" y1="206" x2="252" y2="228"/></g>'
        +'<g stroke="'+GOLD+'" stroke-width=".7" opacity=".5"><line x1="110" y1="214" x2="150" y2="214"/><line x1="180" y1="224" x2="236" y2="224"/><line x1="260" y1="212" x2="300" y2="212"/></g>';
      return refl+body+fg+lit(u,[[132,120],[132,164],[248,120,13,18,.85],[186,164,20,30,.92]]);
    },
    /* ② PENTHOUSE — kule tacı + saran teras + şehir siluети */
    penthouse:function(u){
      var bg=G('bg','<rect x="20" y="168" width="26" height="28"/><rect x="54" y="150" width="20" height="46"/><rect x="360" y="158" width="24" height="38"/><rect x="392" y="140" width="18" height="56"/><rect x="330" y="172" width="18" height="24"/>');
      var mid='<rect x="150" y="70" width="120" height="126" fill="url(#g-glass-'+u+')" stroke="'+CREAM+'" stroke-width="1.4" opacity=".92"/>'
        +G('mid','<line x1="150" y1="104" x2="270" y2="104"/><line x1="150" y1="138" x2="270" y2="138"/><line x1="150" y1="172" x2="270" y2="172"/><line x1="190" y1="70" x2="190" y2="196"/><line x1="230" y1="70" x2="230" y2="196"/>');
      var fg=G('fg','<path d="M144 70 L276 70" stroke="'+GOLD+'" stroke-width="1.2"/>'/* altın tac */
        /* saran teras + korkuluk */
        +'<path d="M138 96 L282 96 L282 108 L138 108 Z" stroke="'+CREAM+'" stroke-width="1.4"/>'
        +'<g stroke="'+GOLD+'" stroke-width=".8"><line x1="146" y1="96" x2="146" y2="108"/><line x1="162" y1="96" x2="162" y2="108"/><line x1="178" y1="96" x2="178" y2="108"/><line x1="242" y1="96" x2="242" y2="108"/><line x1="258" y1="96" x2="258" y2="108"/><line x1="274" y1="96" x2="274" y2="108"/></g>'
        +'<line x1="150" y1="196" x2="270" y2="196"/>');
      return '<ellipse cx="210" cy="88" rx="70" ry="40" fill="url(#g-glow-'+u+')"/>'+bg+mid+fg
        +lit(u,[[158,114],[158,148,13,18,.85],[238,120],[238,178,13,14,.8]])
        +'<g filter="url(#g-warm-'+u+')"><circle cx="30" cy="176" r="1.6" fill="'+GOLDS+'"/><circle cx="368" cy="168" r="1.6" fill="'+GOLDS+'"/></g>';
    },
    /* ③ VILLA — yatay düz çatı + tam cam + havuz + ince ağaç */
    villa:function(u){
      var mid='<rect x="150" y="118" width="150" height="78" fill="url(#g-glass-'+u+')" stroke="'+CREAM+'" stroke-width="1.4" opacity=".92"/>'
        +G('mid','<rect x="96" y="140" width="60" height="56"/><line x1="190" y1="118" x2="190" y2="196"/><line x1="230" y1="118" x2="230" y2="196"/><line x1="270" y1="118" x2="270" y2="196"/>');
      var fg=G('fg','<path d="M86 118 L314 118" stroke="'+GOLD+'" stroke-width="1.2"/>'/* uzayan altın saçak */
        +'<path d="M86 118 L86 128 M314 118 L314 128"/>'
        +'<rect x="112" y="156" width="28" height="40" fill="url(#g-glass-'+u+')"/>');
      /* infinity havuz — önde, villayı kısmen keser */
      var pool='<rect x="150" y="204" width="200" height="30" rx="4" fill="url(#g-pool-'+u+')" stroke="'+GOLDS+'" stroke-width=".8" stroke-opacity=".6"/>'
        +'<g stroke="'+GOLDS+'" stroke-width=".7" opacity=".7"><line x1="168" y1="214" x2="210" y2="214"/><line x1="240" y1="222" x2="300" y2="222"/><line x1="260" y1="210" x2="330" y2="210"/></g>'
        +'<ellipse cx="300" cy="216" rx="40" ry="12" fill="url(#g-glow-'+u+')" opacity=".7"/>';
      /* ince ağaç sol */
      var tree='<g stroke="'+MUT+'" stroke-width="1.1" opacity=".7"><line x1="70" y1="196" x2="70" y2="120"/><path d="M70 132 q-16 -6 -20 -22 M70 128 q16 -8 22 -24 M70 146 q-18 -4 -24 -18 M70 142 q18 -6 22 -20"/></g>';
      return pool+tree+mid+fg+lit(u,[[160,130],[204,130,13,18,.85],[120,164,20,30,.9]]);
    },
    /* ④ REZIDANS — çok ince yüksek kule + ritmik balkon + tac */
    rezidans:function(u){
      var mid='<rect x="180" y="40" width="80" height="156" fill="url(#g-glass-'+u+')" stroke="'+CREAM+'" stroke-width="1.4" opacity=".92"/>'
        +G('mid','<line x1="180" y1="72" x2="260" y2="72"/><line x1="180" y1="104" x2="260" y2="104"/><line x1="180" y1="136" x2="260" y2="136"/><line x1="180" y1="168" x2="260" y2="168"/>');
      /* ritmik balkonlar — sol/sağ alternatif */
      var balc=G('fg','<path d="M170 90 L180 90 L180 96 L170 96 Z"/><path d="M260 122 L270 122 L270 128 L260 128 Z"/><path d="M170 154 L180 154 L180 160 L170 160 Z"/>');
      var fg=G('fg','<path d="M176 40 L264 40 L258 26 L182 26 Z"/>'/* daralan tac */
        +'<line x1="182" y1="26" x2="182" y2="16" stroke="'+GOLD+'" stroke-width="1.1"/><line x1="258" y1="26" x2="258" y2="14" stroke="'+GOLD+'" stroke-width="1.1"/>'
        +'<line x1="200" y1="40" x2="200" y2="196" stroke="'+GOLD+'" stroke-width=".7" opacity=".6"/><line x1="240" y1="40" x2="240" y2="196" stroke="'+GOLD+'" stroke-width=".7" opacity=".6"/>'/* altın pilaster */
        +'<line x1="180" y1="196" x2="260" y2="196"/>');
      return '<ellipse cx="220" cy="34" rx="46" ry="26" fill="url(#g-glow-'+u+')"/>'+mid+balc+fg
        +lit(u,[[186,82],[186,146,13,18,.85],[232,110],[232,174,13,14,.8]]);
    },
    /* ⑤ DAIRE — sakin orta kat blok + pencere ızgarası + giriş */
    daire:function(u){
      var mid=G('mid','<rect x="120" y="86" width="200" height="110"/>'
        +'<line x1="120" y1="118" x2="320" y2="118"/><line x1="120" y1="150" x2="320" y2="150"/>'
        /* ızgara pencereler */
        +'<rect x="136" y="96" width="18" height="14"/><rect x="166" y="96" width="18" height="14"/><rect x="196" y="96" width="18" height="14"/><rect x="226" y="96" width="18" height="14"/><rect x="256" y="96" width="18" height="14"/><rect x="286" y="96" width="18" height="14"/>'
        +'<rect x="136" y="128" width="18" height="14"/><rect x="166" y="128" width="18" height="14"/><rect x="256" y="128" width="18" height="14"/><rect x="286" y="128" width="18" height="14"/>'
        +'<rect x="196" y="126" width="18" height="18"/>'/* balkonlu */
        +'<path d="M192 126 L218 126" stroke="'+GOLD+'" stroke-width=".8"/>');
      var fg=G('fg','<rect x="120" y="86" width="200" height="110"/>'
        +'<path d="M204 160 L204 196 L236 196 L236 160 Z"/>'/* giriş portalı */
        +'<path d="M198 160 L242 160" stroke="'+GOLD+'" stroke-width="1.1"/>'/* altın kanopi */
        +'<rect x="158" y="164" width="18" height="24"/><rect x="264" y="164" width="18" height="24"/>');
      return mid+fg+lit(u,[[208,166,24,28,.92],[162,168,14,20,.85],[268,168,14,20,.8]]);
    },
    /* ⑥ PLAZA — kurumsal prizma 2-nokta perspektif + curtain-wall */
    plaza:function(u){
      var side='<path d="M266 66 L316 82 L316 210 L266 196 Z" fill="url(#g-glassS-'+u+')" stroke="'+CREAM+'" stroke-width="1.4" opacity=".85"/>';
      var front='<rect x="148" y="66" width="118" height="130" fill="url(#g-glass-'+u+')" stroke="'+CREAM+'" stroke-width="1.4" opacity=".92"/>';
      var grid=G('mid','<line x1="176" y1="66" x2="176" y2="196"/><line x1="207" y1="66" x2="207" y2="196"/><line x1="238" y1="66" x2="238" y2="196"/>'
        +'<line x1="148" y1="96" x2="266" y2="96"/><line x1="148" y1="126" x2="266" y2="126"/><line x1="148" y1="156" x2="266" y2="156"/>'
        +'<line x1="291" y1="74" x2="291" y2="203"/><line x1="266" y1="98" x2="316" y2="114"/><line x1="266" y1="130" x2="316" y2="146"/><line x1="266" y1="162" x2="316" y2="178"/>');
      var fg=G('fg','<path d="M148 66 L266 66 L316 82" stroke="'+GOLD+'" stroke-width="1.1"/>'/* parapet */
        +'<rect x="188" y="52" width="34" height="14"/>'/* çatı mekanik */
        +'<rect x="148" y="168" width="118" height="28" fill="url(#g-glass-'+u+')"/>'/* lobi bandı */
        +'<path d="M148 168 L266 168" stroke="'+GOLD+'" stroke-width="1"/>');
      return front+side+grid+fg+lit(u,[[154,102],[154,132,13,18,.85],[213,104],[244,134,13,14,.8],[154,174,20,20,.9]]);
    },
    /* ⑦ DUKKAN — yakın plan zarif vitrin + tente + tabela bandı */
    dukkan:function(u){
      var mid='<rect x="96" y="120" width="248" height="76" fill="url(#g-glass-'+u+')" stroke="'+CREAM+'" stroke-width="1.4" opacity=".92"/>'
        +G('mid','<line x1="176" y1="120" x2="176" y2="196"/><line x1="264" y1="120" x2="264" y2="196"/>'/* pilasterler */
        +'<rect x="196" y="132" width="48" height="64"/>'/* girintili kapı */
        +'<path d="M108 190 L150 132 M280 190 L326 132" stroke="'+CREAM+'" stroke-width=".9" stroke-opacity=".35"/>'/* cam parıltı */);
      /* tente — sığ yamuk + rib */
      var awn='<path d="M92 100 L348 100 L336 122 L104 122 Z" fill="url(#g-pool-'+u+')" stroke="'+GOLD+'" stroke-width="1.1"/>'
        +'<g stroke="'+GOLDD+'" stroke-width=".6" opacity=".7"><line x1="124" y1="100" x2="118" y2="122"/><line x1="160" y1="100" x2="156" y2="122"/><line x1="196" y1="100" x2="194" y2="122"/><line x1="232" y1="100" x2="232" y2="122"/><line x1="268" y1="100" x2="270" y2="122"/><line x1="304" y1="100" x2="308" y2="122"/></g>';
      var fg=G('fg','<rect x="96" y="78" width="248" height="20"/>'/* tabela bandı (boş = zarif) */
        +'<line x1="96" y1="196" x2="344" y2="196"/>'
        +'<circle cx="238" cy="164" r="1.6" fill="'+GOLD+'" stroke="none"/>'/* kapı kolu */);
      return mid+awn+fg
        +'<rect x="96" y="78" width="248" height="20" fill="url(#g-glass-'+u+')" opacity=".4"/>'
        +lit(u,[[120,140,20,44,.55],[288,140,20,44,.5],[206,150,28,44,.5]]);
    },
    /* ⑧ ARSA — plan/site: parsel sınırı + yapı zarfı + kontur + ağaç */
    arsa:function(u){
      var contour='<g stroke="'+MUT+'" stroke-width=".9" opacity=".5"><path d="M40 176 q120 -30 200 -14 t160 -8"/><path d="M40 196 q140 -26 220 -10 t140 -4"/><path d="M60 156 q110 -22 180 -10 t140 -6"/></g>';
      var plot='<path d="M110 118 L340 90 L370 176 L150 210 Z" stroke="'+GOLD+'" stroke-width="1.4"/>';/* parsel */
      var env='<path d="M150 132 L308 112 L328 168 L182 190 Z" stroke="'+CREAM+'" stroke-width="1.2" stroke-dasharray="5 4" opacity=".75"/>';/* yapı zarfı */
      var tree='<g stroke="'+MUT+'" stroke-width="1.1" opacity=".7"><line x1="250" y1="150" x2="250" y2="112"/><circle cx="250" cy="104" r="14" fill="none"/></g>';
      var marker='<g stroke="'+GOLD+'" stroke-width="1"><line x1="104" y1="118" x2="116" y2="118"/><line x1="110" y1="112" x2="110" y2="124"/></g>';
      return contour+'<ellipse cx="240" cy="150" rx="120" ry="50" fill="url(#g-glow-'+u+')" opacity=".5"/>'+plot+env+tree+marker;
    },
    /* ⑨ KÖŞK — simetrik klasik portiko + sütun + alınlık + bahçe */
    kosk:function(u){
      var body=G('mid','<rect x="110" y="104" width="220" height="92"/>'
        +'<line x1="110" y1="150" x2="330" y2="150"/>'
        +'<rect x="132" y="114" width="16" height="28"/><rect x="292" y="114" width="16" height="28"/><rect x="132" y="158" width="16" height="28"/><rect x="292" y="158" width="16" height="28"/>');
      /* portiko: 4 sütun + alınlık */
      var cols='<g stroke="'+CREAM+'" stroke-width="1.4"><line x1="180" y1="96" x2="180" y2="196"/><line x1="188" y1="96" x2="188" y2="196"/><line x1="212" y1="96" x2="212" y2="196"/><line x1="220" y1="96" x2="220" y2="196"/><line x1="244" y1="96" x2="244" y2="196"/><line x1="252" y1="96" x2="252" y2="196"/></g>'
        +'<g stroke="'+GOLD+'" stroke-width=".8"><line x1="176" y1="96" x2="256" y2="96"/><line x1="176" y1="192" x2="256" y2="192"/></g>';/* kapiteller + kaide */
      var ped='<path d="M164 96 L216 68 L268 96 Z" stroke="'+GOLD+'" stroke-width="1.2"/><circle cx="216" cy="86" r="4" stroke="'+GOLD+'" stroke-width=".8"/>';/* alınlık + okülus */
      var door='<rect x="204" y="148" width="24" height="48"/>';
      var garden='<g stroke="'+MUT+'" stroke-width="1" opacity=".55"><path d="M120 210 q90 -18 192 0"/><circle cx="150" cy="204" r="8"/><circle cx="282" cy="204" r="8"/></g>';
      return garden+body+G('fg',door)+cols+ped+'<path d="M104 104 L216 60 L328 104" stroke="'+GOLD+'" stroke-width="1.1"/>'
        +lit(u,[[136,118],[296,118],[208,152,16,40,.9]]);
    }
  };

  window.propScene=function(type,uid){var fn=SCENES[type]||SCENES.daire;var u=uid||('a'+Math.floor(1));return svg(u,fn(u),(type||'gayrimenkul')+' illüstrasyonu');};
  window.PROP_ARCHETYPES=Object.keys(SCENES);
})();
