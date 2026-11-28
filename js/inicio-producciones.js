/* Inicio: arma la vista previa de Producciones con las campañas marcadas
   como destacada: true en data/campanas.js. */
(function(){
  var track = document.getElementById('track');
  if (!track || !window.CAMPANAS) return;
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(ch){ return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]; }); }
  var visibles = window.CAMPANAS.filter(function(c){ return !c.oculta; });
  var dest = visibles.filter(function(c){ return c.destacada; });
  if (!dest.length) dest = visibles;
  var reel = document.getElementById('featuredReel');
  if (reel){
    reel.innerHTML = [false, true].map(function(duplicado){
      return '<div class="reel-set"' + (duplicado ? ' aria-hidden="true"' : '') + '>' +
        dest.map(function(c){
          return '<img src="img/' + esc(c.portada) + '" alt="' + (duplicado ? '' : esc(c.titulo)) + '">';
        }).join('') + '</div>';
    }).join('');
  }
  track.innerHTML = dest.map(function(c){
    return '<a class="work has-media work-link" href="producciones/' + esc(c.slug) + '">' +
      '<div class="work-media" style="--ar:4/5"><img src="img/' + esc(c.portada) + '" alt="" loading="lazy"><span class="work-more" aria-hidden="true">Ver campaña →</span></div>' +
      '<h3>' + esc(c.titulo) + '</h3><p>' + esc(c.descripcionCorta) + '</p></a>';
  }).join('') +
  '<a class="work work-all" href="producciones/"><span class="work-all-n">' + visibles.length + '</span><span class="work-all-t">campañas para recorrer</span><span class="work-all-b">Ver todas las campañas →</span></a>';
})();
