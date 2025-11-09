# Romen · DJ & Producer

Landing page minimalista y colorida para el DJ Romen, lista para desplegar en Vercel como un sitio estático.

## Estructura

- `index.html`: documento principal con todas las secciones (hero, agenda, sonidos, bio y contacto).
- `styles.css`: estilos globales con tipografías, degradados y layout responsive.
- `scripts/main.js`: lógica ligera para navegación, filtros de agenda y validación del formulario.

## Desarrollo local

1. Instala dependencias de desarrollo opcionales si deseas un servidor local:

   ```bash
   npm install --global serve
   ```

2. Inicia un servidor estático desde la raíz del proyecto:

   ```bash
   serve .
   ```

3. Abre `http://localhost:3000` (o el puerto indicado en consola).

## Despliegue en Vercel

1. Inicia sesión en Vercel y crea un nuevo proyecto enlazado a este repositorio.
2. Selecciona el framework "Otros" para desplegar como sitio estático.
3. Mantén el comando de build vacío (no es necesario) y deja la carpeta pública como la raíz del repositorio (`.`).
4. Verifica que la detección automática muestre "Static" como tipo de proyecto. Gracias al archivo `vercel.json` incluido, Vercel servirá `index.html`, `styles.css` y `scripts/main.js` directamente.
5. Despliega y obtén la URL generada por Vercel.

## Personalización

- Actualiza el contenido de la agenda en `scripts/main.js` modificando `agendaData`.
- Reemplaza enlaces de mixes por URLs reales en la sección **Sonidos** de `index.html`.
- Ajusta colores editando las variables CSS definidas al inicio de `styles.css`.
