/* Producciones: arma la grilla, los filtros, la vista de cada campaña y el visor
   a partir de data/campanas.js. No hace falta tocar este archivo para sumar campañas. */
(function(){
  'use strict';
  var BASE = document.querySelector('base').getAttribute('href');      // raíz del sitio, termina en "/"
  var IMG = 'img/';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- datos ---------- */
  var datosOk = false, lista = [], orden = [], cargaPendiente;
  function cargarCampanas(){
    if (cargaPendiente) return cargaPendiente;
    cargaPendiente = new Promise(function(resolve){
      var script = document.createElement('script');
      script.src = BASE + 'data/campanas.js?v=' + Date.now();
      function terminar(){
        script.remove();
        datosOk = Array.isArray(window.CAMPANAS);
        if (datosOk){
          lista = window.CAMPANAS.filter(function(c){ return c && c.slug && c.titulo; });
          orden = window.CATEGORIAS || [];
        }
        resolve();
      }
      script.onload = script.onerror = terminar;
      document.head.appendChild(script);
    }).then(function(){ cargaPendiente = null; });
    return cargaPendiente;
  }
  function fotosDe(c){
    return (c.fotos || []).map(function(f, i){
      return typeof f === 'string' ? { src: f, alt: c.titulo + ', foto ' + (i + 1) } : { src: f.src, alt: f.alt || c.titulo + ', foto ' + (i + 1) };
    });
  }
  function parrafos(t){ return Array.isArray(t) ? t : String(t || '').split(/\n\s*\n/); }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(ch){ return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]; }); }
  function bySlug(s){ for (var i = 0; i < lista.length; i++) if (lista[i].slug === s) return i; return -1; }

  /* ---------- elementos ---------- */
  var $ = function(id){ return document.getElementById(id); };
  var viewGrid = $('viewGrid'), viewCampaign = $('viewCampaign'), app = $('app');
  var filtersEl = $('filters'), gridEl = $('grid');
  var filtro = 'Todos', scrollGrid = 0;

  /* ---------- filtros ---------- */
  function categoriasPresentes(){
    var usadas = {}; lista.forEach(function(c){ usadas[c.categoria] = (usadas[c.categoria] || 0) + 1; });
    var cats = orden.filter(function(k){ return usadas[k]; });
    Object.keys(usadas).forEach(function(k){ if (cats.indexOf(k) < 0) cats.push(k); });   // rubros nuevos que no estén en CATEGORIAS
    return { cats: cats, cuenta: usadas };
  }
  function renderFiltros(){
    if (!datosOk) return;
    var info = categoriasPresentes();
    var html = '<button type="button" class="pr-filter" data-cat="Todos" aria-pressed="' + (filtro === 'Todos') + '">Todos<span>' + lista.length + '</span></button>';
    info.cats.forEach(function(k){
      html += '<button type="button" class="pr-filter" data-cat="' + esc(k) + '" aria-pressed="' + (filtro === k) + '">' + esc(k) + '<span>' + info.cuenta[k] + '</span></button>';
    });
    filtersEl.innerHTML = html;
  }
  filtersEl.addEventListener('click', function(e){
    var b = e.target.closest('.pr-filter'); if (!b) return;
    filtro = b.getAttribute('data-cat');
    [].forEach.call(filtersEl.children, function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    renderGrid();
  });

  /* ---------- grilla ---------- */
  function renderGrid(){
    if (!datosOk) return;
    var items = lista.filter(function(c){ return filtro === 'Todos' || c.categoria === filtro; });
    gridEl.innerHTML = items.map(function(c){
      return '<a class="pr-card" href="producciones/' + esc(c.slug) + '" data-link>' +
        '<div class="pr-card-media"><img src="' + IMG + esc(c.portada) + '" alt="" loading="lazy" decoding="async"><span class="pr-card-more" aria-hidden="true">Ver campaña →</span></div>' +
        '<span class="pr-card-cat">' + esc(c.categoria) + '</span>' +
        '<h2>' + esc(c.titulo) + '</h2>' +
        '<p>' + esc(c.descripcionCorta) + '</p></a>';
    }).join('');
  }

  /* ---------- campaña ---------- */
  var actual = null, galeria = [];
  function renderCampana(i){
    var c = lista[i], fotos = fotosDe(c);
    actual = c;
    document.title = c.titulo + ' · Producciones · Kenai Studio';
    $('cTag').textContent = c.categoria;
    $('cTitle').textContent = c.titulo;
    $('cDesc').innerHTML = parrafos(c.descripcionCampana).map(function(p){ return '<p>' + esc(p) + '</p>'; }).join('');
    $('cIa').hidden = !c.ia;

    galeria = fotos.slice();
    var before = $('cBefore');
    if (c.antes){
      before.hidden = false;
      $('cBeforeImg').src = IMG + c.antes;
      galeria.unshift({ src: c.antes, alt: 'Antes: así nos llegó el producto', antes: true });
    } else { before.hidden = true; $('cBeforeImg').removeAttribute('src'); }

    var g = $('cGallery'), offset = c.antes ? 1 : 0;
    var n = fotos.length, cols = n === 1 ? 1 : (n === 2 || n === 4) ? 2 : 3;
    g.className = 'pr-gallery cols-' + cols;
    g.innerHTML = fotos.map(function(f, k){
      return '<button type="button" class="pr-shot" data-i="' + (k + offset) + '" aria-label="Ver en grande: ' + esc(f.alt) + '"><img src="' + IMG + esc(f.src) + '" alt="' + esc(f.alt) + '" loading="' + (k < 3 ? 'eager' : 'lazy') + '" decoding="async"></button>';
    }).join('');
    $('cCount').textContent = fotos.length === 1 ? '1 foto' : fotos.length + ' fotos';

    var sig = lista[(i + 1) % lista.length];
    var next = $('cNext');
    if (lista.length > 1){ next.hidden = false; next.href = 'producciones/' + sig.slug; next.textContent = 'Siguiente: ' + sig.titulo + ' →'; }
    else next.hidden = true;
  }
  $('cGallery').addEventListener('click', function(e){
    var b = e.target.closest('.pr-shot'); if (b) abrirVisor(+b.getAttribute('data-i'), b);
  });
  $('cBeforeBtn').addEventListener('click', function(){ abrirVisor(0, this); });

  /* ---------- rutas ---------- */
  function slugActual(){
    var q = new URLSearchParams(location.search).get('c');
    if (q) return q;
    var p = location.pathname, i = p.indexOf('/producciones/');
    if (i < 0) return '';
    return decodeURIComponent(p.slice(i + 14).replace(/\/+$/, '').split('/')[0] || '');
  }
  function mostrar(view){
    [viewGrid, viewCampaign].forEach(function(v){ v.hidden = v !== view; v.classList.remove('enter'); });
    if (!reduce){ void view.offsetWidth; view.classList.add('enter'); }
  }
  function route(opts){
    opts = opts || {};
    var slug = slugActual(), i = slug ? bySlug(slug) : -1;
    $('notFound').hidden = !(datosOk && slug && i < 0);
    if (i > -1){
      renderCampana(i); mostrar(viewCampaign);
      window.scrollTo(0, 0);
    } else {
      document.title = 'Producciones · Kenai Studio';
      mostrar(viewGrid);
      window.scrollTo(0, opts.restore ? scrollGrid : 0);
    }
    if (opts.focus) app.focus({ preventScroll: true });
  }
  var ultimaNavegacion = 0;
  function actualizarVista(opts){
    var navegacion = ++ultimaNavegacion;
    cargarCampanas().then(function(){
      if (navegacion !== ultimaNavegacion) return;
      if (datosOk){
        if (filtro !== 'Todos' && categoriasPresentes().cats.indexOf(filtro) < 0) filtro = 'Todos';
        renderFiltros();
        renderGrid();
      } else {
        gridEl.innerHTML = '<p class="pr-notice">No pudimos cargar las campañas. Volvé a intentar en unos minutos.</p>';
      }
      route(opts);
    });
  }
  function ir(href){
    if (!viewGrid.hidden) scrollGrid = window.scrollY;
    var volviendo = /producciones\/?$/.test(href);
    history.pushState({}, '', BASE + href.replace(/^\//, ''));
    actualizarVista({ restore: volviendo, focus: true });
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest('a[data-link]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault(); ir(a.getAttribute('href'));
  });
  window.addEventListener('popstate', function(){ actualizarVista({ restore: true }); });
  window.addEventListener('pageshow', function(e){ if (e.persisted) actualizarVista({ restore: true }); });

  /* Si se llegó desde 404.html (?c=slug), deja la dirección linda: /producciones/slug */
  (function(){
    var q = new URLSearchParams(location.search).get('c');
    if (q) history.replaceState({}, '', BASE + 'producciones/' + encodeURIComponent(q) + location.hash);
  })();

  /* ---------- visor ampliado ---------- */
  var lb = $('lightbox'), lbImg = $('lbImg'), idx = 0, origen = null;
  function pintar(){
    var f = galeria[idx];
    lbImg.src = IMG + f.src; lbImg.alt = f.alt;
    $('lbCap').textContent = f.antes ? 'Antes: así nos llegó el producto' : f.alt;
    $('lbCount').textContent = (idx + 1) + ' / ' + galeria.length;
    var varias = galeria.length > 1;
    $('lbPrev').hidden = !varias; $('lbNext').hidden = !varias;
    [idx - 1, idx + 1].forEach(function(k){ var n = galeria[(k + galeria.length) % galeria.length]; if (n){ var im = new Image(); im.src = IMG + n.src; } });
  }
  function abrirVisor(i, desde){
    if (!galeria.length) return;
    idx = i; origen = desde || null; pintar();
    if (lb.showModal) lb.showModal(); else lb.setAttribute('open', '');
    document.documentElement.style.overflow = 'hidden';
    $('lbClose').focus();
  }
  function cerrarVisor(){ if (lb.open){ lb.close ? lb.close() : lb.removeAttribute('open'); } }
  lb.addEventListener('close', function(){ document.documentElement.style.overflow = ''; if (origen) origen.focus(); });
  function mover(d){ idx = (idx + d + galeria.length) % galeria.length; pintar(); }
  $('lbPrev').addEventListener('click', function(){ mover(-1); });
  $('lbNext').addEventListener('click', function(){ mover(1); });
  $('lbClose').addEventListener('click', cerrarVisor);
  lb.addEventListener('click', function(e){ if (e.target === lb || e.target.classList.contains('lb-inner') || e.target.classList.contains('lb-fig')) cerrarVisor(); });
  lb.addEventListener('keydown', function(e){
    if (e.key === 'ArrowLeft'){ e.preventDefault(); mover(-1); }
    if (e.key === 'ArrowRight'){ e.preventDefault(); mover(1); }
  });
  var tx = null;
  lb.addEventListener('touchstart', function(e){ tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function(e){
    if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 45) mover(dx < 0 ? 1 : -1);
  });

  /* ---------- encabezado ---------- */
  var top = $('top');
  function onScroll(){
    var y = window.scrollY;
    top.classList.toggle('scrolled', y > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- arranque ---------- */
  actualizarVista(); onScroll();
})();
