# Documentación del proyecto

## 📘 Introducción general del proyecto
ChatGPT_API es una pequeña aplicación que sirve de pasarela entre un cliente web
sencillo y la API de OpenAI. Permite enviar mensajes a ChatGPT y ajustar algunos
parámetros como el modelo, la temperatura o el número máximo de tokens. El
servidor está construido con Node.js y Express, mientras que la interfaz se basa
en HTML y JavaScript puro. Se utilizan las siguientes tecnologías:

- **Node.js/Express** para el servidor HTTP.
- **openai** como SDK para acceder a la API de OpenAI.
- **dotenv** para gestionar las variables de entorno.
- **cors** para habilitar peticiones desde el navegador.
- **GitHub Actions** con un flujo de trabajo que compila el proyecto con Webpack.

La estructura es muy simple y sigue un patrón MVC mínimo: el servidor actúa como
controlador que recibe peticiones desde la vista (HTML) y las envía a la API.

## 📂 Estructura de archivos

- `server.js`
  - Servidor Express que expone el endpoint `/chat` y sirve la carpeta `public`.
  - Lee configuraciones de `config.json` y combina los valores recibidos desde el
    cliente.
  - Depende de `express`, `cors`, `openai`, `fs`, `dotenv` y `path`.

- `config.json`
  - Almacena los parámetros por defecto para la llamada a la API de OpenAI.
  - Es leído al inicio por `server.js` para cargar los valores de configuración.

- `public/index.html`
  - Página web que permite al usuario introducir mensajes y mostrar la respuesta.
  - Incluye un pequeño script JavaScript que llama al endpoint `/chat` del
    servidor con los parámetros introducidos.

- `.github/workflows/webpack.yml`
  - Flujo de trabajo de GitHub Actions para compilar el proyecto con Webpack en
    varias versiones de Node.
  - Se ejecuta en cada push o pull request hacia la rama `main`.

- `package.json`
  - Define el nombre del proyecto, dependencias y scripts disponibles (por
    ejemplo, `npm start`).

- `README.md` y `CHANGELOG.md`
  - Documentación principal y registro de cambios de la versión 1.0.0.

## 🔁 Diagramas de interconexión

```
[Cliente Web]
    |
    |  Mensajes HTTP POST
    v
[Express Server (server.js)] -----> [OpenAI API]
    |
    |  Servir archivos estáticos
    v
[public/index.html]
```

El cliente web envía un mensaje al servidor mediante una petición POST al
endpoint `/chat`. El servidor combina las opciones proporcionadas con las
configuraciones por defecto, realiza la solicitud a OpenAI y devuelve la
respuesta al navegador. La misma aplicación también sirve la página `index.html`
a través de Express.
