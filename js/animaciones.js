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
    {"m": "Gimnasio Andes", "r": "Gimnasio", "q": "Con las fotos nuevas, la gente nos escribe diciendo que se siente invitada a entrenar. Ese mes sumamos más inscriptos que en todo el verano.", "n": "Laura M.", "c": "dueña", "did": ["Fotografía", "Retoque"], "tone": "#5B3A2E"},
    {"m": "Ruta 42", "r": "Running", "q": "Pasamos de una foto en la cinta a una campaña que de verdad motiva. Las inscripciones a la maratón se llenaron antes de lo previsto.", "n": "Martín G.", "c": "organizador", "did": ["Fotos de lanzamiento", "Retoque"], "tone": "#1C1B19"},
    {"m": "Óptica Glaciar", "r": "Anteojos", "q": "Los mismos anteojos de siempre, pero ahora la gente los quiere. Las fotos en la nieve cambiaron por completo nuestra tienda online.", "n": "Sofía R.", "c": "encargada de marketing", "did": ["Producto", "E-commerce"], "tone": "#C8402F"},
    {"m": "Nido", "r": "Peluches", "q": "Nos mostraron el producto como lo vive una familia. Ahora cada publicación genera consultas y los peluches se agotan.", "n": "Carolina P.", "c": "fundadora", "did": ["Fotos para redes", "Mensual"], "tone": "#8A847A"},
    {"m": "Pan de Altura", "r": "Panadería", "q": "Nuestro pan siempre fue bueno, pero en las fotos no se notaba. Desde que trabajamos con Kenai, los pedidos por Instagram se duplicaron.", "n": "Diego L.", "c": "socio", "did": ["Gastronomía", "Fotografía"], "tone": "#2E2124"},
    {"m": "Café Cumbre", "r": "Cafetería", "q": "Rápidos, prolijos y con mucha onda. Las fotos del local y del menú hicieron que la gente venga a probar.", "n": "Valentina S.", "c": "dueña", "did": ["Retratos", "Retoque"], "tone": "#6E3426"}
  ];
  var tabs=[].slice.call(document.querySelectorAll('.logo-btn')), pBody=document.getElementById('panelBody');
  function showClient(i){
    var c=clients[i];
    tabs.forEach(function(t,k){t.setAttribute('aria-selected',k===i?'true':'false');t.tabIndex=k===i?0:-1;});
    document.getElementById('pQuote').textContent=c.q;
    document.getElementById('pDid').innerHTML=c.did.map(function(d){return '<span>'+d+'</span>';}).join('');
    document.getElementById('pWho').innerHTML='<strong>'+c.n+'</strong>, '+c.c+' de '+c.m;
    document.getElementById('pAv').textContent=c.n.charAt(0);
    document.getElementById('pShot').style.setProperty('--tone',c.tone);
    document.getElementById('pShotLabel').textContent='Trabajo para '+c.m;
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

  /* before / after: casos reales (las fotos están en la carpeta img) */
  var cases=[
    {b:'gym-antes',a:'gym-despues',ar:'1/1',bp:'50% 50%',ap:'50% 38%',ba:'Antes: dos adultos mayores con pesas rusas frente a una pared de ladrillos',aa:'Después: clase de gimnasio con adultos mayores y un nene, llena de energía'},
    {b:'cinta-antes',a:'maraton-despues',ar:'1/1',bp:'50% 35%',ap:'50% 40%',ba:'Antes: mujer corriendo en una cinta del gimnasio',aa:'Después: campaña de entrenamiento para una maratón de 42K'},
    {b:'anteojos-antes',a:'anteojos-despues',ar:'1/1',bp:'50% 64%',ap:'50% 62%',ba:'Antes: anteojos de sol sobre un estuche en un escritorio',aa:'Después: los mismos anteojos sobre la nieve, con montañas de fondo'},
    {b:'buho-antes',a:'buho-familia-despues',ar:'1/1',bp:'50% 42%',ap:'40% 50%',ba:'Antes: peluche de búho sostenido con la mano',aa:'Después: una mamá y dos chicos durmiendo abrazados a los peluches'},
    {b:'buho2-antes',a:'buho-regalo-despues',ar:'1/1',bp:'50% 52%',ap:'55% 50%',ba:'Antes: peluche de búho sobre una cama',aa:'Después: una abuela regala el peluche a su nieto'}
  ];
  var compare=document.getElementById('compare'), range=document.getElementById('baRange');
  var imgA=document.getElementById('imgAfter'), imgB=document.getElementById('imgBefore');
  var caseBtns=[].slice.call(document.querySelectorAll('.case'));
  function setX(v){compare.style.setProperty('--x',v+'%');}
  range.addEventListener('input',function(){setX(range.value);hinted=true;});
  
  function showCase(i){
    var c=cases[i];
    caseBtns.forEach(function(btn,k){btn.setAttribute('aria-selected',k===i?'true':'false');btn.tabIndex=k===i?0:-1;});
    compare.classList.add('loading');
    setTimeout(function(){
      imgA.src='img/'+c.a+'.jpg'; imgA.alt=c.aa; imgA.style.objectPosition=c.ap;
      imgB.src='img/'+c.b+'.jpg'; imgB.alt=c.ba; imgB.style.objectPosition=c.bp;
      setX(50); range.value=50;
      compare.classList.remove('loading');
    }, reduce?0:220);
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
  imgA.style.objectPosition=cases[0].ap; imgB.style.objectPosition=cases[0].bp;
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
  document.getElementById('form').addEventListener('submit',function(e){
    e.preventDefault();
    var st=document.getElementById('status'), name=document.getElementById('f-nombre').value.trim(), mail=document.getElementById('f-mail').value.trim();
    if(!name||!mail){st.innerHTML='Completá tu nombre y un email o WhatsApp para que podamos responderte.';return;}
    var needs=[].slice.call(document.querySelectorAll('.chip[aria-pressed="true"]')).map(function(c){return c.textContent;}).join(', ');
    var msg=document.getElementById('f-msg').value.trim();
    var body='Nombre y marca: '+name+'\nContacto: '+mail+(needs?'\nNecesito: '+needs:'')+(msg?'\n\n'+msg:'');
    window.location.href='mailto:kenaistudio.arg@gmail.com?subject='+encodeURIComponent('Consulta desde la web: '+name)+'&body='+encodeURIComponent(body);
    st.innerHTML='Se abrió tu correo con la consulta lista para enviar. Si no se abrió, escribinos a <strong>kenaistudio.arg@gmail.com</strong>.';
  });
})();
