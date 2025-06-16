import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const SERVICE_URL = process.env.SERVICE_URL || 'http://localhost:5000';

app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.post('/assistants/:assistantId/invoke', async (req, res) => {
  try {
    const url = `${SERVICE_URL}/assistants/${req.params.assistantId}/invoke`;
    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await upstream.text();
    res.status(upstream.status).send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('upstream error');
  }
});

app.get('/assistants/:assistantId/runs/:runId/events', async (req, res) => {
  const url = `${SERVICE_URL}/assistants/${req.params.assistantId}/runs/${req.params.runId}/events`;
  try {
    const upstream = await fetch(url);
    res.status(upstream.status);
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    upstream.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

app.use('/app', express.static(path.join(__dirname, '../frontend/dist')));

const PORT = process.env.PORT || 2024;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
