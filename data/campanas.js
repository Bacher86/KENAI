/* =====================================================================
   CAMPAÑAS DE KENAI STUDIO
   ---------------------------------------------------------------------
   Este es el único archivo que hay que tocar para sumar o editar campañas.
   La página de Producciones, cada campaña y la vista previa del inicio
   se arman solas a partir de esta lista.

   CÓMO SUMAR UNA CAMPAÑA
   1. Subí las fotos a la carpeta img/ con el nombre de la campaña adelante,
      en minúsculas y sin espacios. Ej: cafe-cumbre-portada.jpg, cafe-cumbre-1.jpg
   2. Copiá la PLANTILLA de abajo, pegala al principio de la lista
      (justo después de "var CAMPANAS = [") y completá los datos.
   3. Guardá con "Commit changes". En unos minutos está publicada.

   REGLAS PARA QUE NO SE ROMPA
   - Los textos van entre comillas simples: 'así'. Si el texto lleva un
     apóstrofo, escribilo con barra:  'Kenai\'s'.
   - Cada campaña termina con  },   (llave y coma).
   - El slug es la dirección de la campaña: en minúsculas, sin tildes,
     sin espacios (usá guiones). Ej: 'cafe-cumbre' → /producciones/cafe-cumbre
   - Las fotos se escriben con el nombre exacto del archivo, igual que en img/
     (mayúsculas, minúsculas y extensión .jpg incluidas).

   PLANTILLA (copiar desde la llave de apertura hasta la coma final)
   {
     id: 10,
     slug: 'nombre-de-la-campana',
     titulo: 'Nombre de la campaña',
     categoria: 'Gastronomía',       // Indumentaria, Deportes, Accesorios, Hogar o Gastronomía
     descripcionCorta: 'Una línea para la tarjeta.',
     descripcionCampana: [
       'Primer párrafo: qué necesitaba la marca.',
       'Segundo párrafo: la idea y cómo la producimos.'
     ],
     portada: 'nombre-de-la-campana-portada.jpg',
     antes: 'nombre-de-la-campana-antes.jpg',   // opcional: borrá la línea si no hay foto de antes
     fotos: [
       { src: 'nombre-de-la-campana-1.jpg', alt: 'Qué se ve en la foto' },
       { src: 'nombre-de-la-campana-2.jpg', alt: 'Qué se ve en la foto' }
     ],
     destacada: false,               // true = aparece en el inicio (conviene que sean 4)
     ia: false                       // true = muestra el aviso "Escenas potenciadas con IA"
   },
   ===================================================================== */

/* Orden en que se muestran los filtros. Un rubro aparece en la página
   solo cuando tiene al menos una campaña cargada. */
var CATEGORIAS = ['Indumentaria', 'Deportes', 'Accesorios', 'Hogar', 'Gastronomía'];

var CAMPANAS = [
  {
    "id": 14,
    "slug": "traje-de-bano-fila",
    "titulo": "Traje de baño FILA",
    "categoria": "Indumentaria",
    "descripcionCorta": "Un traje de baño azul marino en una campaña de verano junto a la pileta.",
    "descripcionCampana": [
      "El punto de partida fue una foto del traje de baño sobre la cama. Lo llevamos a una escena de verano para mostrar cómo queda puesto y darle contexto al producto.",
      "Las tomas junto al agua muestran el calce de frente y de espalda. Los planos de producto acercan los cordones, el interior rojo y el parche bordado."
    ],
    "portada": "traje-de-bano-fila-1.jpg",
    "antes": "traje-de-bano-fila-antes.jpg",
    "fotos": [
      {
        "src": "traje-de-bano-fila-1.jpg",
        "alt": "Modelo con el traje de baño FILA azul marino en una reposera junto a la pileta"
      },
      {
        "src": "traje-de-bano-fila-2.jpg",
        "alt": "Vista frontal del traje de baño puesto, con gotas de agua y las manos en los bolsillos"
      },
      {
        "src": "traje-de-bano-fila-3.jpg",
        "alt": "Modelo de espaldas junto a la pileta, con el bolsillo trasero a la vista"
      },
      {
        "src": "traje-de-bano-fila-4.jpg",
        "alt": "Traje de baño azul marino extendido sobre un bloque de piedra junto al agua"
      },
      {
        "src": "traje-de-bano-fila-5.jpg",
        "alt": "Traje de baño FILA sobre baldosas, con los cordones claros y la cintura roja a la vista"
      },
      {
        "src": "traje-de-bano-fila-6.jpg",
        "alt": "Primer plano del parche bordado y las gotas sobre la tela, junto a una toalla blanca"
      }
    ],
    "destacada": false,
    "ia": false
  },
  {
    "id": 13,
    "slug": "buzo-marron",
    "titulo": "Buzo marrón",
    "categoria": "Indumentaria",
    "descripcionCorta": "Un buzo color chocolate entre luces nocturnas, reflejos y calles mojadas.",
    "descripcionCampana": [
      "Partimos de una foto del buzo sobre la cama y lo llevamos a la ciudad de noche. Los retratos muestran cómo cae la prenda y cómo contrasta la franja clara con el marrón chocolate.",
      "Las tomas de producto alternan la prenda completa con detalles del cuello, el cierre metálico y el bordado marfil."
    ],
    "portada": "buzo-marron-1.jpg",
    "antes": "buzo-marron-antes.jpg",
    "fotos": [
      {
        "src": "buzo-marron-1.jpg",
        "alt": "Modelo con el brazo apoyado en una baranda, con el buzo marrón y la ciudad iluminada detrás"
      },
      {
        "src": "buzo-marron-2.jpg",
        "alt": "Modelo con buzo marrón mirando hacia una avenida mojada de noche"
      },
      {
        "src": "buzo-marron-3.jpg",
        "alt": "Vista de espalda del buzo marrón junto a una vidriera iluminada"
      },
      {
        "src": "buzo-marron-4.jpg",
        "alt": "Buzo doblado sobre el capó mojado de un auto, junto a guantes y un vaso de café"
      },
      {
        "src": "buzo-marron-5.jpg",
        "alt": "Buzo marrón colgado de una baranda con luces urbanas al fondo"
      },
      {
        "src": "buzo-marron-6.jpg",
        "alt": "Buzo extendido sobre una superficie de piedra bajo luz cálida"
      },
      {
        "src": "buzo-marron-7.jpg",
        "alt": "Detalle del cuello, el cierre metálico y el bordado del buzo"
      },
      {
        "src": "buzo-marron-8.jpg",
        "alt": "Primer plano del bordado marfil de un ciclista sobre la tela marrón"
      }
    ],
    "destacada": false,
    "ia": false
  },
  {
    "id": 12,
    "slug": "silla-comedor",
    "titulo": "Silla de comedor",
    "categoria": "Hogar",
    "descripcionCorta": "Una silla clásica de madera y jacquard en interiores iluminados por el sol.",
    "descripcionCampana": [
      "Partimos de una foto de la silla junto al sillón. La campaña la muestra en interiores con luz natural, con espacio para apreciar la curva del respaldo y el acabado de la madera.",
      "Las escenas junto a la ventana y la chimenea muestran cómo encaja la silla en distintos ambientes. El primer plano acerca el dibujo geométrico y la textura del tapizado."
    ],
    "portada": "silla-comedor-1.jpg",
    "antes": "silla-comedor-antes.jpg",
    "fotos": [
      {
        "src": "silla-comedor-1.jpg",
        "alt": "Silla clásica de madera con asiento geométrico frente a una pared con molduras"
      },
      {
        "src": "silla-comedor-2.jpg",
        "alt": "Mujer leyendo sentada en la silla junto a una ventana luminosa"
      },
      {
        "src": "silla-comedor-3.jpg",
        "alt": "Silla en un rincón con una mesa de mármol, una taza y un libro"
      },
      {
        "src": "silla-comedor-4.jpg",
        "alt": "Vista lateral de la silla junto a una chimenea de mármol"
      },
      {
        "src": "silla-comedor-5.jpg",
        "alt": "Detalle del tapizado jacquard geométrico y el borde de madera pulida"
      }
    ],
    "destacada": false,
    "ia": false
  },
  {
    "id": 11,
    "slug": "reloj-citizen",
    "titulo": "Reloj Citizen",
    "categoria": "Accesorios",
    "descripcionCorta": "De una foto sobre la mesa a una campaña elegante para el Citizen Eco-Drive.",
    "descripcionCampana": [
      "El punto de partida fue una foto del reloj apoyado sobre una mesa. La idea fue mostrar el Citizen Eco-Drive como un accesorio de vestir, con la esfera negra y el brazalete metálico en primer plano.",
      "La luz azul de la portada define el contorno del reloj. Los reflejos cálidos y el mármol oscuro resaltan el metal, y la toma en la muñeca muestra cómo queda con un traje."
    ],
    "portada": "reloj-citizen-portada.jpg",
    "antes": "reloj-citizen-previo.jpg",
    "fotos": [
      {
        "src": "reloj-citizen-portada.jpg",
        "alt": "Reloj Citizen Eco-Drive de esfera negra y brazalete metálico sobre fondo azul"
      },
      {
        "src": "reloj-citizen-luz-calida.jpg",
        "alt": "Primer plano del reloj Citizen bajo luz cálida, junto a un vaso de cristal"
      },
      {
        "src": "reloj-citizen-marmol-negro.jpg",
        "alt": "Reloj Citizen de pie sobre mármol negro pulido, con el brazalete reflejado en la superficie"
      },
      {
        "src": "reloj-citizen-marmol-oscuro.jpg",
        "alt": "Esfera del Citizen en primer plano sobre mármol oscuro, con reflejos dorados"
      },
      {
        "src": "reloj-citizen-traje.jpg",
        "alt": "Reloj Citizen en la muñeca junto al puño blanco de una camisa y un traje negro"
      },
      {
        "src": "reloj-citizen-accesorios.jpg",
        "alt": "Reloj Citizen sobre una mesa junto a gemelos, una billetera de cuero y un saco"
      }
    ],
    "destacada": false,
    "ia": false
  },
   {
    id: 10,
    slug: 'camisalino',
    titulo: 'Antonio Saiello',
    categoria: 'Indumentaria',
    descripcionCorta: 'Camisa de lino de Antonio Saiello.',
    descripcionCampana: [
      'Hay prendas que no solo visten, sino que te transportan. Nuestra camisa de lino puro italiano captura la esencia más auténtica del verano en la Costa Amalfitana: la brisa cálida del mar Tirreno, una terraza frente a Positano al atardecer y el brillo de un Aperol Spritz helado en buena compañía.',
      'La línea Sorrento de Antonio Saiello nace para quienes buscan frescura real sin resignar sastrería impecable.'
    ],
    portada: 'camisalino-portada.jpg',
    antes: 'camisalino-previo.jpeg',
    fotos: [
      { 
        src: 'camisalino-portada.jpg', 
        alt: 'Camisa de lino beige crudo Antonio Saiello apoyada sobre balaustrada de piedra al atardecer frente al mar en Sorrento junto a una copa de Aperol Spritz, un limón y una revista' 
      },
      { 
        src: 'camisalino1.jpg', 
        alt: 'Camisa de lino beige crudo Antonio Saiello desplegada sobre banco de piedra caliza bajo la luz del sol mediterráneo con gafas de sol de carey y limones de Sorrento' 
      },
      { 
        src: 'camisalino2.jpg', 
        alt: 'Camisa de lino beige crudo Antonio Saiello descansando sobre un sillón de cuero marrón en un interior elegante de estilo italiano junto a libros de la Costa Amalfitana' 
      },
      { 
        src: 'camisalino3.jpg', 
        alt: 'Modelo masculino apoyado en un muro de piedra en la Costa Amalfitana vistiendo la camisa de lino beige crudo Antonio Saiello con pantalones de lino blanco y gafas de sol' 
      },
      { 
        src: 'camisalino4.jpg', 
        alt: 'Modelo sentado en una terraza panorámica frente a Positano disfrutando de un Aperol Spritz mientras viste la camisa de lino beige crudo Antonio Saiello con mangas remangadas' 
      }
    ],
    destacada: false,
    ia: true
  },
  {
    id: 9,
    slug: 'remeras-masashi',
    titulo: 'Remeras Masashi 98 Turbo',
    categoria: 'Indumentaria',
    descripcionCorta: 'Una línea de remeras con espíritu de taller y cultura JDM.',
    descripcionCampana: [
      'La marca necesitaba fotos que hablaran el mismo idioma que su público: autos, fierros y cultura japonesa de los noventa.',
      'Llevamos las remeras a su terreno: colgadas en un taller, apoyadas sobre el capot de un deportivo rojo y armadas con casco, llaves y herramientas. Cada escena muestra el diseño de frente y de espalda sin perder la actitud.'
    ],
    portada: 'remera-capot.jpg',
    antes: 'remera-masashi-previo.jpeg',
    fotos: [
      { src: 'remera-capot.jpg', alt: 'Espalda de la remera Masashi 98 Turbo sobre el capot de un auto deportivo rojo' },
      { src: 'remera-taller.jpg', alt: 'Remera negra colgada en un taller de autos, con el logo Masashi en el pecho' },
      { src: 'remera-flatlay.jpg', alt: 'Remeras Masashi sobre el asfalto junto a un casco, una llave y una herramienta' },
      { src: 'remera-retrato-urbano.jpg', alt: 'Modelo con la remera negra Masashi 98 Turbo, agachado junto a un auto con llanta dorada al atardecer' },
      { src: 'remera-encuentro-nocturno.jpg', alt: 'Modelo de espaldas con la remera Masashi 98 Turbo junto a un auto rojo en un encuentro nocturno entre contenedores' }
    ],
    destacada: false,
    ia: false
  },
  {
    id: 8,
    slug: 'short-deportivo',
    titulo: 'Short deportivo',
    categoria: 'Deportes',
    descripcionCorta: 'De la ficha del mayorista a cuatro escenas reales de entrenamiento.',
    descripcionCampana: [
      'El producto llegó como una ficha de catálogo: correcta, pero igual a la de cualquier otro vendedor del mismo short.',
      'Lo sacamos a la calle. Cuatro colores, cuatro momentos del día y cuatro formas de entrenar, con el bolsillo lateral siempre a la vista porque es lo que lo diferencia. La gente no compra un short: compra cómo se va a sentir usándolo.'
    ],
    portada: 'short-despues-1.jpg',
    antes: 'short-antes.jpg',
    fotos: [
      { src: 'short-despues-1.jpg', alt: 'Corredora sonriente cruzando la calle al atardecer con el short lila' },
      { src: 'short-despues-3.jpg', alt: 'Corredora bajo la lluvia en la ciudad con el short marrón y el celular en el bolsillo' },
      { src: 'short-despues-2.jpg', alt: 'Mujer elongando de noche en una pista mojada con el short negro' },
      { src: 'short-despues-4.jpg', alt: 'Mujer corriendo en un parque al amanecer con el short gris' }
    ],
    destacada: true,
    ia: true
  },
  {
    id: 7,
    slug: 'reloj-deportivo',
    titulo: 'Reloj deportivo',
    categoria: 'Accesorios',
    descripcionCorta: 'De la foto de catálogo a seis escenas con actitud.',
    descripcionCampana: [
      'Un reloj resistente al agua mostrado sobre fondo blanco con un salpicón de agua: la típica foto que no se distingue de la competencia.',
      'Construimos seis escenas que prueban lo que el producto promete: lluvia, gimnasio, entrenamiento duro y ciudad de noche. El reloj siempre es el protagonista y la pantalla se lee en cada toma.'
    ],
    portada: 'reloj-despues-6.jpg',
    antes: 'reloj-antes.jpg',
    fotos: [
      { src: 'reloj-despues-6.jpg', alt: 'El reloj mojado sobre una roca, entre salpicaduras de agua y luz verde' },
      { src: 'reloj-despues-1.jpg', alt: 'El reloj sobre el piso mojado de un gimnasio, con una pesa rusa de fondo' },
      { src: 'reloj-despues-2.jpg', alt: 'Mujer entrenando con sogas de batalla y el reloj en la muñeca' },
      { src: 'reloj-despues-3.jpg', alt: 'Hombre transpirado bajo un puente al atardecer, mostrando el reloj' },
      { src: 'reloj-despues-4.jpg', alt: 'El reloj en la muñeca de un corredor bajo la lluvia, en una calle con luces de neón' },
      { src: 'reloj-despues-5.jpg', alt: 'Corredora mirando el reloj bajo la lluvia de noche' }
    ],
    destacada: true,
    ia: true
  },
  {
    id: 6,
    slug: 'sandalias-nueva-coleccion',
    titulo: 'Sandalias: nueva colección',
    categoria: 'Indumentaria',
    descripcionCorta: 'De una foto con el celular a cinco piezas de campaña para el mismo par.',
    descripcionCampana: [
      'La tienda tenía una sola foto del producto, sacada con el celular en la vereda. Necesitaba lanzar la colección de verano en redes.',
      'Armamos una campaña completa a partir de ese único par: una portada de lanzamiento, una escena de verano, una pieza de cuotas, una de estilo de vida y una de detalles que explica por qué son cómodas. Cinco formas de contar el mismo producto.'
    ],
    portada: 'calzado-despues-1.jpg',
    antes: 'calzado-antes.jpg',
    fotos: [
      { src: 'calzado-despues-1.jpg', alt: 'Modelo sosteniendo la sandalia frente a su cara, con el título Nueva colección' },
      { src: 'calzado-despues-2.jpg', alt: 'Modelo sonriente con sombrero sentada sobre un muro blanco, fondo amarillo y turquesa' },
      { src: 'calzado-despues-3.jpg', alt: 'Las sandalias bajando una escalera de piedra, con el texto El par para toda ocasión' },
      { src: 'calzado-despues-4.jpg', alt: 'Mujer en un café con las sandalias puestas y los usos del calzado' },
      { src: 'calzado-despues-5.jpg', alt: 'La sandalia sobre fondo bordó con detalles de hebilla, brillo, plantilla y taco' }
    ],
    destacada: true,
    ia: true
  },
  {
    id: 5,
    slug: 'maraton-42k',
    titulo: 'Maratón 42K',
    categoria: 'Deportes',
    descripcionCorta: 'Una foto en la cinta del gimnasio, convertida en campaña de maratón.',
    descripcionCampana: [
      'El punto de partida fue una foto de una corredora en la cinta del gimnasio. El objetivo: promocionar un plan de entrenamiento para correr una maratón.',
      'Contamos el final de la historia en lugar del esfuerzo: la medalla, el festejo y la meta cumplida. Una foto que hace que el plan se quiera empezar hoy.'
    ],
    portada: 'maraton-despues.jpg',
    antes: 'cinta-antes.jpg',
    fotos: [
      { src: 'maraton-despues.jpg', alt: 'Corredora festejando con su medalla frente al espejo del gimnasio' }
    ],
    destacada: true,
    ia: false
  },
  {
    id: 4,
    slug: 'entrenar-en-familia',
    titulo: 'Entrenar en familia',
    categoria: 'Deportes',
    descripcionCorta: 'Fotos para un gimnasio que transmiten energía y ganas de sumarse.',
    descripcionCampana: [
      'El gimnasio quería mostrar que sus clases son para todas las edades, pero sus fotos eran frías y estáticas.',
      'Buscamos la energía de una clase real: adultos mayores entrenando con ganas y un chico que se suma al movimiento. Una imagen que invita a entrar.'
    ],
    portada: 'gym-despues.jpg',
    antes: 'gym-antes.jpg',
    fotos: [
      { src: 'gym-despues.jpg', alt: 'Adultos mayores entrenando con pesas mientras un nene salta en el reflejo' }
    ],
    destacada: false,
    ia: false
  },
  {
    id: 3,
    slug: 'anteojos-de-sol',
    titulo: 'Anteojos de sol',
    categoria: 'Accesorios',
    descripcionCorta: 'Del escritorio a la nieve: el producto en el escenario de la marca.',
    descripcionCampana: [
      'Los anteojos estaban fotografiados sobre su estuche, en un escritorio. Bien iluminados, pero sin historia.',
      'Los llevamos a la montaña nevada, donde un anteojo de sol tiene sentido. El mismo producto, ahora con un lugar y un momento que la gente quiere vivir.'
    ],
    portada: 'anteojos-despues.jpg',
    antes: 'anteojos-antes.jpg',
    fotos: [
      { src: 'anteojos-despues.jpg', alt: 'Anteojos de sol sobre la nieve con montañas de fondo' }
    ],
    destacada: false,
    ia: false
  },
  {
    id: 2,
    slug: 'peluche-hora-de-dormir',
    titulo: 'Peluche: hora de dormir',
    categoria: 'Hogar',
    descripcionCorta: 'El producto dentro de la escena que una familia quiere vivir.',
    descripcionCampana: [
      'Un peluche de búho fotografiado en la mano. Lindo, pero sin el contexto que hace que un papá o una mamá lo quiera comprar.',
      'Lo pusimos donde va a vivir: en la cama, a la hora de dormir, abrazado por los chicos. La foto vende el momento, no solo el muñeco.'
    ],
    portada: 'buho-familia-despues.jpg',
    antes: 'buho-antes.jpg',
    fotos: [
      { src: 'buho-familia-despues.jpg', alt: 'Mamá y dos chicos durmiendo abrazados a sus peluches' }
    ],
    destacada: false,
    ia: false
  },
  {
    id: 1,
    slug: 'peluche-el-regalo',
    titulo: 'Peluche: el regalo',
    categoria: 'Hogar',
    descripcionCorta: 'La misma pieza, contada como el regalo perfecto.',
    descripcionCampana: [
      'Con el mismo producto quisimos llegar a otro público: quienes compran para regalar.',
      'Una abuela que le entrega el peluche a su nieto. Misma marca, mismo búho, otra historia y otro motivo de compra.'
    ],
    portada: 'buho-regalo-despues.jpg',
    antes: 'buho2-antes.jpg',
    fotos: [
      { src: 'buho-regalo-despues.jpg', alt: 'Abuela regalando un peluche de búho a su nieto' }
    ],
    destacada: false,
    ia: false
  }
];
