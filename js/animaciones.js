(function(){
  document.documentElement.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function(v,a,b){return Math.max(a,Math.min(b,v));};
  var lerp = function(a,b,t){return a+(b-a)*t;};
  var ease = function(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;};
  function hex(h){h=h.replace('#','');return [parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)];}
  function mixStops(stops,t){
    var n=stops.length-1, i=Math.min(n-1,Math.floor(t*n)), lt=t*n-i;
    var a=hex(stops[i]), b=hex(stops[i+1]);
    return 'rgb('+Math.round(lerp(a[0],b[0],lt))+','+Math.round(lerp(a[1],b[1],lt))+','+Math.round(lerp(a[2],b[2],lt))+')';
  }

  /* stars */
  var starsC=document.querySelector('.stars');
  function drawStars(){
    var r=starsC.getBoundingClientRect(), d=Math.min(2,window.devicePixelRatio||1);
    starsC.width=r.width*d; starsC.height=r.height*d;
    var x=starsC.getContext('2d'); x.scale(d,d);
    var rnd=mulberry(7);
    for(var i=0;i<170;i++){
      var sx=rnd()*r.width, sy=rnd()*r.height*.62, s=rnd()*1.3+.2;
      x.fillStyle='rgba(244,239,230,'+(rnd()*.6+.15)+')';
      x.beginPath(); x.arc(sx,sy,s,0,Math.PI*2); x.fill();
    }
  }
  function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

  /* sample still: a dawn landscape rendered in canvas */
  var still=document.getElementById('still');
  function drawStill(){
    if(!still) return;
    var r=still.getBoundingClientRect(), d=Math.min(2,window.devicePixelRatio||1);
    var w=r.width, h=r.height; if(!w||!h) return;
    still.width=w*d; still.height=h*d;
    var x=still.getContext('2d'); x.scale(d,d);
    var g=x.createLinearGradient(0,0,0,h);
    g.addColorStop(0,'#1A1316'); g.addColorStop(.45,'#5A2620'); g.addColorStop(.7,'#C8553C'); g.addColorStop(1,'#E9A27F');
    x.fillStyle=g; x.fillRect(0,0,w,h);
    var sx=w*.66, sy=h*.6, sr=Math.min(w,h)*.11;
    var gl=x.createRadialGradient(sx,sy,sr*.5,sx,sy,sr*5);
    gl.addColorStop(0,'rgba(255,190,150,.55)'); gl.addColorStop(1,'rgba(255,190,150,0)');
    x.fillStyle=gl; x.fillRect(0,0,w,h);
    x.fillStyle='#F2A07E'; x.beginPath(); x.arc(sx,sy,sr,0,Math.PI*2); x.fill();
    var rnd=mulberry(21);
    var layers=[['#9A4A3A',.56,.10],['#6E3328',.63,.13],['#45221E',.71,.16],['#2A1718',.8,.2],['#1C1B19',.9,.18]];
    layers.forEach(function(L){
      var p1=rnd()*6, p2=rnd()*6, p3=rnd()*6, f=1+rnd()*1.5;
      x.fillStyle=L[0]; x.beginPath(); x.moveTo(0,h);
      for(var px=0;px<=w;px+=4){
        var u=px/w;
        var y=h*L[1]-h*L[2]*(.55*Math.abs(Math.sin(u*3.1*f+p1))+.3*Math.sin(u*7.3+p2)+.15*Math.sin(u*17+p3));
        x.lineTo(px,y);
      }
      x.lineTo(w,h); x.closePath(); x.fill();
    });
    var img=x.getImageData(0,0,still.width,still.height), dt=img.data;
    for(var i=0;i<dt.length;i+=4){var n=(rnd()-.5)*18; dt[i]+=n; dt[i+1]+=n; dt[i+2]+=n;}
    x.putImageData(img,0,0);
  }

  /* media drop / pick */
  function setMedia(el,file){
    if(!file) return;
    var url=URL.createObjectURL(file), box=el.querySelector('.work-media')||el;
    var old=box.querySelector('img,video'); if(old) old.remove();
    var m;
    if(file.type.indexOf('video')===0){m=document.createElement('video');m.muted=true;m.loop=true;m.playsInline=true;m.autoplay=true;}
    else{m=document.createElement('img');m.alt='Producción cargada';}
    m.src=url; box.insertBefore(m,box.firstChild); el.classList.add('has-media');
    var p=box.querySelector('.play'); if(p&&m.tagName==='IMG') p.remove();
  }
  document.querySelectorAll('input[type=file][data-target]').forEach(function(inp){
    inp.addEventListener('change',function(){setMedia(document.getElementById(inp.dataset.target),inp.files[0]);});
  });
  document.querySelectorAll('[data-drop]').forEach(function(el){
    el.addEventListener('dragover',function(e){e.preventDefault();el.classList.add('dragging');});
    el.addEventListener('dragleave',function(){el.classList.remove('dragging');});
    el.addEventListener('drop',function(e){e.preventDefault();el.classList.remove('dragging');setMedia(el,e.dataTransfer.files[0]);});
  });

  /* story words */
  var story=document.querySelector('.story'), words=[];
  if(story){
    var txt=story.textContent.trim().split(/\s+/);
    story.innerHTML=txt.map(function(w){return '<span class="w">'+w+'</span>';}).join(' ');
    words=[].slice.call(story.querySelectorAll('.w'));
    if(reduce) words.forEach(function(w){w.classList.add('on');});
  }

  /* productions pin */
  var works=document.getElementById('producciones'), track=document.getElementById('track'), bar=document.getElementById('worksBar'), dist=0;
  function layoutWorks(){
    if(reduce||window.innerWidth<760){works.classList.remove('is-pinned');works.style.height='';track.style.transform='';return;}
    works.classList.add('is-pinned');
    dist=Math.max(0,track.scrollWidth-window.innerWidth);
    works.style.height=(dist+window.innerHeight)+'px';
  }

  /* refs */
  var hero=document.querySelector('.hero'), ridges=[].slice.call(document.querySelectorAll('.ridge')), heroCopy=document.querySelector('.hero-copy');
  var horizon=document.getElementById('horizon'), stage=document.getElementById('stage'), sun=document.getElementById('sun'), glow=document.getElementById('glow'), caps=[].slice.call(document.querySelectorAll('.cap'));
  var frame=document.getElementById('mainFrame'), top=document.getElementById('top');
  var sky=['#3B1D18','#7A2E22','#D9876A','#F4EFE6'];

  function frameUpdate(){
    var vh=window.innerHeight;
    /* hero parallax */
    var hr=hero.getBoundingClientRect(), hp=clamp(-hr.top/hr.height,0,1);
    if(!reduce){
      ridges.forEach(function(r){r.style.transform='translate3d(0,'+(hp*parseFloat(r.dataset.depth)*-90)+'px,0)';});
      heroCopy.style.transform='translate3d(0,'+(hp*120)+'px,0)';
      heroCopy.style.opacity=String(1-hp*.9);
    }
    /* still zoom */
    if(frame&&!reduce){var fr=frame.getBoundingClientRect(), fp=clamp((vh-fr.top)/(vh+fr.height),0,1);[].forEach.call(frame.querySelectorAll('canvas,img,video'),function(m){m.style.transform='scale('+(1.04-fp*.04)+')';});}
    /* story words */
    if(words.length&&!reduce){
      var sr=story.getBoundingClientRect(), sp=clamp((vh*.82-sr.top)/(sr.height+vh*.25),0,1), lit=Math.round(sp*words.length);
      for(var i=0;i<words.length;i++) words[i].classList.toggle('on',i<lit);
    }
    /* productions */
    if(works.classList.contains('is-pinned')){
      var wr=works.getBoundingClientRect(), wp=clamp(-wr.top/(wr.height-vh),0,1);
      track.style.transform='translate3d('+(-wp*dist)+'px,0,0)';
      bar.style.width=(wp*100)+'%';
    }
    /* horizon sunrise */
    var zr=horizon.getBoundingClientRect(), zp=reduce?1:clamp(-zr.top/(zr.height-vh),0,1), e=ease(zp);
    var bg=mixStops(sky,e);
    stage.style.background=bg;
    stage.style.color=e>.6?'#1C1B19':'#F4EFE6';
    sun.setAttribute('cy',lerp(138,74,e).toFixed(2));
    glow.setAttribute('cy',lerp(138,74,e).toFixed(2));
    glow.setAttribute('opacity',(Math.sin(e*Math.PI)*.35).toFixed(3));
    caps.forEach(function(c){c.setAttribute('fill',bg);});
    /* header tone */
    var tone='night';
    if(zr.top<=40&&zr.bottom>40){tone=e>.6?'day':'night';}
    else if(zr.bottom<=40){tone='day';}
    top.dataset.tone=tone;
    top.classList.toggle('scrolled',window.scrollY>20);
  }

  var ticking=false;
  function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(function(){frameUpdate();ticking=false;});}}
  function onResize(){drawStars();drawStill();layoutWorks();frameUpdate();}
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onResize);
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){layoutWorks();frameUpdate();});}
  onResize();
  window.addEventListener('load',onResize);

  /* clients + testimonials */
  // Comentarios de clientes: m = marca, r = rubro, q = comentario, n = nombre, c = cargo, did = etiquetas, tone = color
  var clients=[
    {"m": "", "r": "Gimnasio", "q": "Con las fotos nuevas, la gente nos escribe diciendo que se siente invitada a entrenar. Ese mes sumamos más inscriptos que en todo el verano.", "n": "", "c": "", "did": [], "tone": "#1C1B19"},
    {"m": "", "r": "Running", "q": "Pasamos de una foto en la cinta a una campaña que de verdad motiva. Las inscripciones a la maratón se llenaron antes de lo previsto.", "n": "", "c": "", "did": [], "tone": "#1C1B19"},
    {"m": "", "r": "Anteojos", "q": "Los mismos anteojos de siempre, pero ahora la gente los quiere. Las fotos en la nieve cambiaron por completo nuestra tienda online.", "n": "", "c": "", "did": [], "tone": "#1C1B19"},
    {"m": "", "r": "Peluches", "q": "Nos mostraron el producto como lo vive una familia. Ahora cada publicación genera consultas y los peluches se agotan.", "n": "", "c": "", "did": [], "tone": "#1C1B19"},
    {"m": "", "r": "Panadería", "q": "Nuestro pan siempre fue bueno, pero en las fotos no se notaba. Desde que trabajamos con Kenai, los pedidos por Instagram se duplicaron.", "n": "", "c": "", "did": [], "tone": "#1C1B19"},
    {"m": "", "r": "Cafetería", "q": "Rápidos, prolijos y con mucha onda. Las fotos del local y del menú hicieron que la gente venga a probar.", "n": "", "c": "", "did": [], "tone": "#1C1B19"}
  ];
  var tabs=[].slice.call(document.querySelectorAll('.logo-btn')), pBody=document.getElementById('panelBody');
  function showClient(i){
    var c=clients[i]; if(!c) return;
    tabs.forEach(function(t,k){t.setAttribute('aria-selected',k===i?'true':'false');t.tabIndex=k===i?0:-1;});
    document.getElementById('pQuote').textContent=c.q||'';
    document.getElementById('pDid').innerHTML=(c.did||[]).map(function(d){return '<span>'+d+'</span>';}).join('');
    var who=[c.n?'<strong>'+c.n+'</strong>':'',c.c,c.m?'de '+c.m:''].filter(Boolean).join(c.n&&c.c?', ':' ');
    document.getElementById('pWho').innerHTML=who;
    document.getElementById('pAv').textContent=(c.n||c.m||c.r||'K').charAt(0);
    document.getElementById('pShot').style.setProperty('--tone',c.tone||'#1C1B19');
    document.getElementById('pShotLabel').textContent=c.m?'Trabajo para '+c.m:(c.r||'');
    pBody.classList.remove('swap'); void pBody.offsetWidth; pBody.classList.add('swap');
  }
  tabs.forEach(function(t,i){
    t.tabIndex=i===0?0:-1;
    t.addEventListener('click',function(){showClient(i);});
    t.addEventListener('keydown',function(e){
      var k=e.key, j=null;
      if(k==='ArrowRight'||k==='ArrowDown') j=(i+1)%tabs.length;
      if(k==='ArrowLeft'||k==='ArrowUp') j=(i-1+tabs.length)%tabs.length;
      if(j!==null){e.preventDefault();showClient(j);tabs[j].focus();}
    });
  });

  /* floating CTA: after the hero, hidden at contact */
  var floatBtn=document.getElementById('float'), contactSec=document.getElementById('contacto');
  function floatUpdate(){
    var past=hero.getBoundingClientRect().bottom<0;
    var atContact=contactSec.getBoundingClientRect().top<window.innerHeight*.8;
    floatBtn.classList.toggle('show',past&&!atContact);
  }
  window.addEventListener('scroll',floatUpdate,{passive:true});
  floatUpdate();

  /* chips + form */
  document.querySelectorAll('.chip').forEach(function(c){c.addEventListener('click',function(){c.setAttribute('aria-pressed',c.getAttribute('aria-pressed')==='true'?'false':'true');});});
  /* El formulario manda la consulta por FormSubmit (formsubmit.co) a kenaistudio.arg@gmail.com.
     Para cambiar el mail que recibe las consultas, cambialo en el action del <form> en index.html. */
  var form=document.getElementById('form'), sendBtn=form.querySelector('.send'), st=document.getElementById('status');
  if(/[?&]enviado=1/.test(location.search)){
    st.textContent='¡Gracias! Recibimos tu consulta y te respondemos a la brevedad.';
    history.replaceState(null,'',location.pathname+'#contacto');
  }
  form.addEventListener('submit',function(e){
    var name=document.getElementById('f-nombre').value.trim(), mail=document.getElementById('f-mail').value.trim();
    if(!name||!mail){e.preventDefault();st.textContent='Completá tu nombre y un email o WhatsApp para que podamos responderte.';return;}
    if(document.getElementById('f-honey').value){e.preventDefault();return;}
    var needs=[].slice.call(document.querySelectorAll('.chip[aria-pressed="true"]')).map(function(c){return c.textContent;}).join(', ');
    document.getElementById('f-needs').value=needs||'No marcó ninguna opción';
    document.getElementById('f-subject').value='Consulta desde la web: '+name;
    document.getElementById('f-next').value=location.origin+location.pathname+'?enviado=1#contacto';
    sendBtn.textContent='Enviando…';
  });
  window.addEventListener('pageshow',function(){sendBtn.textContent='Enviar consulta';});
})();
