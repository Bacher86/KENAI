# Kenai Studio

Sitio web de Kenai Studio: producción de fotos que hacen vender.

Dirección: **https://kenaistudio.com.ar** (el dominio está en DonWeb y apunta a GitHub Pages; el archivo `CNAME` mantiene la conexión, no lo borres). Se publica solo con GitHub Pages cada vez que guardás un cambio en la rama `main` (tarda uno o dos minutos).

## Producciones (portfolio de campañas)

- Página: **kenaistudio.com.ar/producciones** · cada campaña: **/producciones/nombre-de-la-campana**
- Todas las campañas están en **`data/campanas.js`**. Para sumar una, seguí las instrucciones que están arriba de todo en ese archivo (o la guía "Cómo subir una campaña nueva").
- Las campañas con `destacada: true` aparecen en el inicio (máximo 4).
- No toques `producciones/index.html`, `js/producciones.js` ni `404.html`: se arman solos a partir de los datos.

## Qué hay en cada archivo

| Archivo | Qué tiene | Qué podés cambiar ahí |
|---|---|---|
| `index.html` | Todos los textos de la página | Títulos, párrafos, servicios, nombres de los casos, datos de contacto |
| `css/estilos.css` | El diseño | Colores (arriba de todo, en `:root`), tamaños, espaciados |
| `js/animaciones.js` | Animaciones y partes interactivas | Comentarios de clientes y casos de antes y después |
| `img/` | Las fotos | Subir fotos nuevas o reemplazar las que están |

## Cómo editar desde GitHub

1. Abrí el archivo y tocá el lápiz (Edit) arriba a la derecha.
2. Para encontrar un texto, usá Ctrl+F (Cmd+F en Mac) y buscá una palabra que veas en la página.
3. Cambiá solo el texto, sin tocar lo que está entre `<` y `>` ni las comillas.
4. Tocá **Commit changes** y confirmá.

### Dónde está cada sección en `index.html`

Buscá estas palabras con Ctrl+F:

- Encabezado y menú: `class="top"`
- Portada ("Hacete notar"): `id="inicio"`
- Carrusel de fotos: `class="still"`
- Quiénes somos y Qué hacemos: `id="nosotros"`
- Antes y después: `id="diferencia"`
- Producciones: `id="producciones"`
- Clientes: `id="clientes"`
- Contacto: `id="contacto"`
- Pie de página: `<footer`

### Comentarios de clientes

Están en `js/animaciones.js`. Buscá `var clients` y cambiá el nombre de la marca, el comentario y la persona de cada uno, respetando las comillas y las comas.

### Reemplazar una foto

La forma más fácil es subir la foto nueva a `img/` con **exactamente el mismo nombre** que la que querés reemplazar (por ejemplo, `gym-despues.jpg`). En la carpeta `img/` tocá **Add file → Upload files** y subila.

## Pendientes antes de difundir

- La sección Clientes está oculta (atributo `hidden` en `index.html`). Cuando tengan comentarios reales, cargalos en `js/animaciones.js`, cambiá las marcas en `index.html` (buscá `logo-btn`), borrá `hidden` y volvé a agregar el link "Clientes" al menú.
- Completar el WhatsApp en la sección de contacto (el texto entre corchetes).
- Subir las fotos en alta resolución.

## Si después de un cambio la página se ve rara o mezclada

El navegador puede guardar una copia vieja de `css/estilos.css` o `js/animaciones.js` hasta por 10 minutos. Esperá un poco y recargá con Ctrl+Shift+R (en el celular, cerrá y abrí la pestaña). Si editás alguno de esos dos archivos, cambiá también el número que aparece después de `?v=` en `index.html` (al final de `estilos.css?v=` o de `animaciones.js?v=`), cualquier número nuevo sirve, así todos los visitantes cargan la versión nueva al instante.
