import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2024;
const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

app.post('/', async (req, res) => {
  if (!EXTERNAL_API_URL) {
    return res.status(500).json({ error: 'EXTERNAL_API_URL not set' });
  }

  try {
    const response = await fetch(EXTERNAL_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error forwarding request:', error);
    res.status(500).json({ error: 'Failed to fetch external API' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
