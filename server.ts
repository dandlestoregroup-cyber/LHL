import 'dotenv/config';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { createServer as createViteServer } from 'vite';

const app = express();
const port = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';
const allowedEventTypes = new Set([
  'enquiry.created',
  'enquiry.stage_changed',
  'community_approval.recorded',
  'scout_lead.created',
]);

app.use('/api/activepieces', express.json({ limit: '64kb' }));

app.post('/api/activepieces', async (req, res) => {
  const event = req.body;
  const webhookUrl = process.env.ACTIVEPIECES_WEBHOOK_URL;
  const sharedSecret = process.env.ACTIVEPIECES_SHARED_SECRET;

  if (!webhookUrl || !sharedSecret) {
    return res.status(503).json({ error: 'automation_not_configured' });
  }

  if (
    !event ||
    event.version !== 1 ||
    event.source !== 'lhl-web' ||
    event.dataMode !== 'demo' ||
    event.synthetic !== true ||
    typeof event.id !== 'string' ||
    !allowedEventTypes.has(event.type)
  ) {
    return res.status(400).json({ error: 'invalid_or_live_event' });
  }

  let parsedWebhook: URL;
  try {
    parsedWebhook = new URL(webhookUrl);
  } catch {
    return res.status(503).json({ error: 'invalid_automation_configuration' });
  }

  const localDev = parsedWebhook.hostname === 'localhost' || parsedWebhook.hostname === '127.0.0.1';
  if (parsedWebhook.protocol !== 'https:' && !(localDev && parsedWebhook.protocol === 'http:')) {
    return res.status(503).json({ error: 'webhook_must_use_https' });
  }

  const timestamp = Date.now().toString();
  const body = JSON.stringify(event);
  const signature = crypto
    .createHmac('sha256', sharedSecret)
    .update(`${timestamp}.${body}`)
    .digest('hex');

  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-lhl-event-id': event.id,
        'x-lhl-timestamp': timestamp,
        'x-lhl-signature': `sha256=${signature}`,
        'x-lhl-simulation': 'true',
      },
      body,
      signal: AbortSignal.timeout(8000),
    });

    if (!upstream.ok) {
      return res.status(502).json({ error: 'automation_upstream_rejected', status: upstream.status });
    }

    return res.status(202).json({ accepted: true, eventId: event.id });
  } catch {
    return res.status(502).json({ error: 'automation_upstream_unavailable' });
  }
});

if (isProduction) {
  const root = path.dirname(fileURLToPath(import.meta.url));
  const dist = path.join(root, 'dist');
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
} else {
  const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
  app.use(vite.middlewares);
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Little Hut Light listening on :${port}`);
});
