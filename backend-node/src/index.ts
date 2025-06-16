import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { join } from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const EXTERNAL_BASE = 'http://localhost:6000';

// serve frontend build
const frontendPath = join(__dirname, '../../frontend/dist');
app.use('/app', express.static(frontendPath));
app.get('/app/*', (_, res) => {
  res.sendFile(join(frontendPath, 'index.html'));
});

app.post('/assistants/:id/invoke', async (req, res) => {
  try {
    const url = `${EXTERNAL_BASE}/assistants/${req.params.id}/invoke`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    res.status(resp.status);
    resp.body?.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'proxy_failed' });
  }
});

app.get('/assistants/:id/runs/:runId/events', async (req, res) => {
  const url = `${EXTERNAL_BASE}/assistants/${req.params.id}/runs/${req.params.runId}/events`;
  const abort = new AbortController();
  req.on('close', () => abort.abort());
  try {
    const resp = await fetch(url, { signal: abort.signal });
    res.status(resp.status);
    for (const [key, value] of resp.headers) {
      res.setHeader(key, value);
    }
    resp.body?.pipe(res);
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).end();
    } else {
      res.end();
    }
  }
});

const port = Number(process.env.PORT) || 2024;
app.listen(port, () => {
  console.log(`Backend listening on ${port}`);
});
