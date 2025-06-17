// Express se utiliza para crear el servidor HTTP que expondrá la API
const express = require('express');
// Módulo de Node.js para leer archivos de configuración
const fs = require('fs');
// Utilidades para construir rutas de forma segura
const path = require('path');
// Middleware que habilita CORS para peticiones desde el navegador
const cors = require('cors');
// SDK oficial de OpenAI para invocar la API de ChatGPT
const { Configuration, OpenAIApi } = require('openai');
// Carga de variables definidas en ".env" (ej. OPENAI_API_KEY)
require('dotenv').config();

// Creación de la aplicación Express
const app = express();
// Permite recibir y procesar payloads en formato JSON
app.use(express.json());
// Habilitamos CORS para permitir peticiones desde el cliente web
app.use(cors());

// Ruta absoluta al archivo de configuración por defecto
const CONFIG_PATH = path.join(__dirname, 'config.json');
// Objeto donde se almacenará la configuración cargada desde el archivo
let userConfig = {};

/**
 * Lee el archivo de configuración y actualiza `userConfig`.
 * En caso de error se deja la configuración por defecto (objeto vacío).
 */
function loadConfig() {
  try {
    const data = fs.readFileSync(CONFIG_PATH, 'utf8');
    userConfig = JSON.parse(data);
  } catch (err) {
    console.error('Failed to load config:', err);
    userConfig = {};
  }
}

loadConfig();

// Inicializa el cliente de OpenAI con la clave proporcionada en las variables de entorno
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Devuelve al cliente la configuración actual usada por el servidor
app.get('/config', (req, res) => {
  res.json(userConfig);
});

// Punto de entrada principal para solicitar una respuesta de ChatGPT
app.post('/chat', async (req, res) => {
  // Verifica que la clave de la API esté disponible
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'API key not configured.' });
  }

  // Mensajes enviados por el cliente y opciones adicionales
  const { messages, options } = req.body;
  // Se combinan las opciones recibidas con las cargadas desde el archivo
  const params = { ...userConfig, ...(options || {}) };
  try {
    const completion = await openai.createChatCompletion({
      model: params.model,
      messages,
      temperature: params.temperature,
      max_tokens: params.max_tokens,
      top_p: params.top_p,
      frequency_penalty: params.frequency_penalty,
      presence_penalty: params.presence_penalty,
    });
    // Devuelve al cliente únicamente el cuerpo de la respuesta
    res.json(completion.data);
  } catch (err) {
    console.error('OpenAI error:', err.response ? err.response.data : err.message);
    res.status(500).json({ error: 'Failed to fetch completion.' });
  }
});

// Sirve la carpeta "public" para exponer la interfaz web estática
app.use(express.static(path.join(__dirname, 'public')));

// Levanta el servidor en el puerto indicado o 3000 por defecto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
