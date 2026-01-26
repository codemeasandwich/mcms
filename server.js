const express = require('express');
const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

const messages = []; // In-memory storage

// GET /messages or GET /messages?from=<ISO date>
app.get('/messages', (req, res) => {
  const { from } = req.query;
  if (from) {
    const fromDate = new Date(from);
    return res.json(messages.filter(m => m.createdAt >= fromDate));
  }
  res.json(messages);
});

// POST /messages
app.post('/messages', (req, res) => {
  const { userName, text } = req.body;
  const message = { userName, text, createdAt: new Date() };
  console.log('Message received:', message);
  messages.push(message);
  res.status(201).json(message);
});

const PORT = process.env.PORT || 3030;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Keep reference to prevent garbage collection
server.on('error', (err) => {
  console.error('Server error:', err);
});
