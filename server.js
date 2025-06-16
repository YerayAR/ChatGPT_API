const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const CONFIG_PATH = path.join(__dirname, 'config.json');
let userConfig = {};

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

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.get('/config', (req, res) => {
  res.json(userConfig);
});

app.post('/chat', async (req, res) => {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'API key not configured.' });
  }

  const { messages, options } = req.body;
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
    res.json(completion.data);
  } catch (err) {
    console.error('OpenAI error:', err.response ? err.response.data : err.message);
    res.status(500).json({ error: 'Failed to fetch completion.' });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
