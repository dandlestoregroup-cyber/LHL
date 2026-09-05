import 'dotenv/config';
import crypto from 'node:crypto';
import path from 'node:path';
import express from 'express';
import {
  AutomationIngressError,
  createDemoAutomationGuard,
  createFixedWindowRateLimiter,
} from './src/lib/automation-gateway';

const app = express();
const port = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';
const configuredLimit = Number(process.env.AUTOMATION_RATE_LIMIT || 30);
const automationRateLimit = Number.isFinite(configuredLimit) && configuredLimit > 0 ? Math.floor(configuredLimit) : 30;
const automationGuard = createDemoAutomationGuard();
const rateLimiter = createFixedWindowRateLimiter(automationRateLimit, 60_000);

app.use('/api/activepieces', express.json({ limit: '64kb' }));

app.post('/api/activepieces', async (req, res) => {
  const clientKey = req.socket.remoteAddress || 'unknown';
  if (!rateLimiter.allow(clientKey)) {
    res.setHeader('retry-after', '60');
    return res.status(429).json({ error: 'automation_rate_limited' });
  }

  const webhookUrl = process.env.ACTIVEPIECES_WEBHOOK_URL;
  const sharedSecret = process.env.ACTIVEPIECES_SHARED_SECRET;

  if (!webhookUrl || !sharedSecret) {
    return res.status(503).json({ error: 'automation_not_configured' });
  }

  let prepared;
  try {
    prepared = automationGuard.prepare(req.body);
  } catch (error) {
    if (error instanceof AutomationIngressError) {
      return res.status(error.status).json({ error: error.code });
    }
    return res.status(400).json({ error: 'invalid_automation_event' });
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
  const body = JSON.stringify(prepared.event);
  const signature = crypto
    .createHmac('sha256', sharedSecret)
    .update(`${timestamp}.${body}`)
    .digest('hex');

  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-lhl-event-id': prepared.event.id,
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

    prepared.commit();
    return res.status(202).json({ accepted: true, eventId: prepared.event.id });
  } catch {
    return res.status(502).json({ error: 'automation_upstream_unavailable' });
  }
});

if (isProduction) {
  const dist = path.join(process.cwd(), 'dist');
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
  app.use(vite.middlewares);
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Little Hut Light listening on :${port}`);
});
