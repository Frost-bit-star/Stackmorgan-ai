import express from 'express';
import bodyParser from 'body-parser';
import PaxSenixAI from '@paxsenix/ai';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Initialize PaxSenixAI (free access – no API key)
const paxsenix = new PaxSenixAI();

// POST endpoint to handle chat requests
app.post('/chat', async (req, res) => {
  const { messages, model } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid or missing messages array' });
  }

  try {
    const chatResponse = await paxsenix.Chat.createCompletion({
      model: model || 'gpt-3.5-turbo',
      messages,
    });

    res.json({ response: chatResponse.choices[0].message });
  } catch (error) {
    console.error('PaxSenix AI error:', error);
    res.status(500).json({ error: 'Something went wrong with PaxSenix AI' });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('PaxSenix AI API is running.');
});

// Start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});