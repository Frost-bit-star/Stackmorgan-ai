import express from 'express';
import bodyParser from 'body-parser';
import PaxSenixAI from '@paxsenix/ai';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Initialize PaxSenixAI (free access – no API key)
const paxsenix = new PaxSenixAI();

// System prompt to define AI behavior
const SYSTEM_PROMPT = {
  role: 'system',
  content: `You are the Troverstar Marketplace AI Assistant. Your job is to help buyers and sellers on the Troverstar platform. 
You assist with tasks like listing items, finding products, handling orders, shipping questions, and general support. 
Provide friendly, clear, and useful answers tailored to online marketplace users.`
};

// POST endpoint to handle chat requests
app.post('/chat', async (req, res) => {
  const { messages, model } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid or missing messages array' });
  }

  try {
    // Prepend system prompt to user messages
    const fullMessages = [SYSTEM_PROMPT, ...messages];

    const chatResponse = await paxsenix.Chat.createCompletion({
      model: model || 'gpt-3.5-turbo',
      messages: fullMessages,
    });

    res.json({ response: chatResponse.choices[0].message });
  } catch (error) {
    console.error('PaxSenix AI error:', error);
    res.status(500).json({ error: 'Something went wrong with PaxSenix AI' });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Troverstar AI Assistant is running.');
});

// Start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});