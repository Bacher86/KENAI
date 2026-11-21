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

  /* Antes y después: casos reales (las fotos están en la carpeta img).
     Cada caso tiene una foto de antes (b) y una o más versiones de después (v).
     bp/ap = qué parte de la foto se ve (horizontal vertical); ba/aa = descripción de la foto. */
  var cases=[
    {b:'calzado-antes',bp:'50% 60%',ba:'Antes: foto con celular de una mujer probándose las sandalias blancas en la calle',v:[
      {a:'calzado-despues-1',ap:'50% 50%',aa:'Después: modelo sosteniendo la sandalia frente a su cara, con el título Nueva colección'},
      {a:'calzado-despues-2',ap:'50% 50%',aa:'Después: modelo sonriente con sombrero sentada sobre un muro blanco, fondo amarillo y turquesa'},
      {a:'calzado-despues-3',ap:'50% 50%',aa:'Después: las sandalias bajando una escalera de piedra, con el texto El par para toda ocasión'},
      {a:'calzado-despues-4',ap:'50% 50%',aa:'Después: mujer en un café con las sandalias puestas y los usos del calzado'},
      {a:'calzado-despues-5',ap:'50% 50%',aa:'Después: la sandalia sobre fondo bordó con detalles de hebilla, brillo, plantilla y taco'}
    ]},
    {b:'reloj-antes',bp:'50% 50%',ba:'Antes: foto de catálogo del reloj sobre fondo blanco con un salpicón de agua',v:[
      {a:'reloj-despues-6',ap:'50% 50%',aa:'Después: el reloj mojado sobre una roca, entre salpicaduras de agua y luz verde'},
      {a:'reloj-despues-1',ap:'50% 50%',aa:'Después: el reloj sobre el piso mojado de un gimnasio, con una pesa rusa de fondo'},
      {a:'reloj-despues-2',ap:'50% 50%',aa:'Después: mujer entrenando con sogas de batalla y el reloj en la muñeca'},
      {a:'reloj-despues-3',ap:'50% 50%',aa:'Después: hombre transpirado bajo un puente al atardecer, mostrando el reloj'},
      {a:'reloj-despues-4',ap:'50% 50%',aa:'Después: el reloj en la muñeca de un corredor bajo la lluvia, en una calle con luces de neón'},
      {a:'reloj-despues-5',ap:'50% 50%',aa:'Después: corredora mirando el reloj bajo la lluvia de noche'}
    ]},
    {b:'short-antes',bp:'50% 50%',ba:'Antes: ficha de catálogo del short deportivo lila con talles y colores',v:[
      {a:'short-despues-1',ap:'50% 50%',aa:'Después: corredora sonriente cruzando la calle al atardecer con el short lila'},
      {a:'short-despues-2',ap:'50% 50%',aa:'Después: mujer elongando de noche en una pista mojada con el short negro'},
      {a:'short-despues-3',ap:'50% 50%',aa:'Después: corredora bajo la lluvia en la ciudad con el short marrón y el celular en el bolsillo'},
      {a:'short-despues-4',ap:'50% 50%',aa:'Después: mujer corriendo en un parque al amanecer con el short gris'}
    ]},
    {b:'gym-antes',bp:'50% 50%',ba:'Antes: dos adultos mayores con pesas rusas frente a una pared de ladrillos',v:[{a:'gym-despues',ap:'50% 38%',aa:'Después: clase de gimnasio con adultos mayores y un nene, llena de energía'}]},
    {b:'cinta-antes',bp:'50% 35%',ba:'Antes: mujer corriendo en una cinta del gimnasio',v:[{a:'maraton-despues',ap:'50% 40%',aa:'Después: campaña de entrenamiento para una maratón de 42K'}]},
    {b:'anteojos-antes',bp:'50% 64%',ba:'Antes: anteojos de sol sobre un estuche en un escritorio',v:[{a:'anteojos-despues',ap:'50% 62%',aa:'Después: los mismos anteojos sobre la nieve, con montañas de fondo'}]},
    {b:'buho-antes',bp:'50% 42%',ba:'Antes: peluche de búho sostenido con la mano',v:[{a:'buho-familia-despues',ap:'12% 50%',aa:'Después: una mamá y dos chicos durmiendo abrazados a los peluches'}]},
    {b:'buho2-antes',bp:'50% 52%',ba:'Antes: peluche de búho sobre una cama',v:[{a:'buho-regalo-despues',ap:'30% 50%',aa:'Después: una abuela regala el peluche a su nieto'}]}
  ];
  var compare=document.getElementById('compare'), range=document.getElementById('baRange');
  var imgA=document.getElementById('imgAfter'), imgB=document.getElementById('imgBefore');
  var caseBtns=[].slice.call(document.querySelectorAll('.case'));
  var versions=document.getElementById('versions'), versionsRow=document.getElementById('versionsRow');
  var current=0;
  function setX(v){compare.style.setProperty('--x',v+'%');}
  range.addEventListener('input',function(){setX(range.value);hinted=true;});
  /* precarga las fotos de un caso para que cambiar de versión sea instantáneo */
  function preload(c){[c.b].concat(c.v.map(function(x){return x.a;})).forEach(function(n){var im=new Image();im.src='img/'+n+'.jpg';});}

  function swap(fn){
    compare.classList.add('loading');
    setTimeout(function(){fn();compare.classList.remove('loading');}, reduce?0:220);
  }
  function showVersion(k,keepLine){
    var c=cases[current], v=c.v[k];
    [].forEach.call(versionsRow.children,function(btn,j){btn.setAttribute('aria-pressed',j===k?'true':'false');});
    swap(function(){
      imgA.src='img/'+v.a+'.jpg'; imgA.alt=v.aa; imgA.style.objectPosition=v.ap;
      if(!keepLine){setX(50); range.value=50;}
    });
  }
  function buildVersions(c){
    versionsRow.innerHTML='';
    versions.hidden=c.v.length<2;
    c.v.forEach(function(v,k){
      var btn=document.createElement('button');
      btn.type='button'; btn.className='version'; btn.setAttribute('aria-pressed',k===0?'true':'false');
      btn.setAttribute('aria-label','Versión '+(k+1)+' de '+c.v.length);
      var im=document.createElement('img'); im.src='img/'+v.a+'.jpg'; im.alt=''; im.loading='lazy';
      btn.appendChild(im);
      btn.addEventListener('click',function(){showVersion(k,true);});
      versionsRow.appendChild(btn);
    });
  }
  function showCase(i){
    current=i; var c=cases[i], v=c.v[0];
    caseBtns.forEach(function(btn,k){btn.setAttribute('aria-selected',k===i?'true':'false');btn.tabIndex=k===i?0:-1;});
    buildVersions(c); preload(c);
    swap(function(){
      imgA.src='img/'+v.a+'.jpg'; imgA.alt=v.aa; imgA.style.objectPosition=v.ap;
      imgB.src='img/'+c.b+'.jpg'; imgB.alt=c.ba; imgB.style.objectPosition=c.bp;
      setX(50); range.value=50;
    });
  }
  caseBtns.forEach(function(btn,i){
    btn.tabIndex=i===0?0:-1;
    btn.addEventListener('click',function(){showCase(i);});
    btn.addEventListener('keydown',function(e){
      var k=e.key,j=null;
      if(k==='ArrowDown'||k==='ArrowRight') j=(i+1)%caseBtns.length;
      if(k==='ArrowUp'||k==='ArrowLeft') j=(i-1+caseBtns.length)%caseBtns.length;
      if(j!==null){e.preventDefault();showCase(j);caseBtns[j].focus();}
    });
  });
  imgA.style.objectPosition=cases[0].v[0].ap; imgB.style.objectPosition=cases[0].bp;
  buildVersions(cases[0]); preload(cases[0]);
  /* one invitation to drag, the first time the slider comes into view */
  var hinted=false;
  function hint(){
    if(hinted||reduce) return; hinted=true;
    var t0=null, seq=[50,25,75,50];
    function step(ts){
      if(!t0) t0=ts; var t=(ts-t0)/1900; if(t>=1){setX(50);range.value=50;return;}
      var seg=Math.min(2,Math.floor(t*3)), lt=ease((t*3)-seg), v=lerp(seq[seg],seq[seg+1],lt);
      setX(v.toFixed(2)); range.value=v; requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting&&e.intersectionRatio>.5){hint();io.disconnect();}});},{threshold:[.5]});
    io.observe(compare);
  }

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
