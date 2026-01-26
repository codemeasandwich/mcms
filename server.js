const express = require('express');
const app = express();

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
  messages.push(message);
  res.status(201).json(message);
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
