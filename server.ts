import 'dotenv/config';
import crypto from 'node:crypto';
import path from 'node:path';
import express, { type Request, type Response } from 'express';
import {
  AutomationIngressError,
  createDemoAutomationGuard,
  createFixedWindowRateLimiter,
} from './src/lib/automation-gateway';
import {
  LiveStoreError,
  advanceLiveEnquiry,
  bootstrapFirstScout,
  createLiveEnquiry,
  createScoutProperty,
  loadLiveDataset,
  recordLiveCommunityApproval,
  sessionPartner,
} from './src/server/live-store';
import {
  authenticatePassword,
  clearSession,
  readSession,
  setSession,
  type LiveSession,
} from './src/server/session-auth';

const app = express();
const port = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';
const configuredLimit = Number(process.env.AUTOMATION_RATE_LIMIT || 30);
const automationRateLimit = Number.isFinite(configuredLimit) && configuredLimit > 0 ? Math.floor(configuredLimit) : 30;
const automationGuard = createDemoAutomationGuard();
const automationLimiter = createFixedWindowRateLimiter(automationRateLimit, 60_000);
const authLimiter = createFixedWindowRateLimiter(12, 60_000);
const publicEnquiryLimiter = createFixedWindowRateLimiter(10, 60_000);

app.use('/api', express.json({ limit: '64kb' }));

const clientKey = (req: Request): string => req.socket.remoteAddress || 'unknown';

const requireSession = (req: Request): LiveSession => {
  const session = readSession(req);
  if (!session) throw new LiveStoreError('authentication_required', 401);
  return session;
};

const sendError = (res: Response, error: unknown): Response => {
  if (error instanceof LiveStoreError) return res.status(error.status).json({ error: error.code });
  console.error('[LHL server]', error);
  return res.status(500).json({ error: 'server_error' });
};

app.post('/api/auth/sign-up', async (req, res) => {
  if (!authLimiter.allow(clientKey(req))) return res.status(429).json({ error: 'auth_rate_limited' });
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const bootstrapEmail = process.env.LHL_BOOTSTRAP_EMAIL?.trim().toLowerCase();
  if (!bootstrapEmail || email !== bootstrapEmail) return res.status(403).json({ error: 'signup_not_invited' });
  try {
    const identity = await authenticatePassword(email, String(req.body?.password || ''), true);
    const session = setSession(res, identity.uid, identity.email);
    return res.status(201).json({ authenticated: true, email: session.email, partner: await sessionPartner(session) });
  } catch (error) {
    const code = error instanceof Error ? error.message : 'authentication_failed';
    return res.status(400).json({ error: code });
  }
});

app.post('/api/auth/sign-in', async (req, res) => {
  if (!authLimiter.allow(clientKey(req))) return res.status(429).json({ error: 'auth_rate_limited' });
  try {
    const identity = await authenticatePassword(String(req.body?.email || ''), String(req.body?.password || ''), false);
    const session = setSession(res, identity.uid, identity.email);
    return res.json({ authenticated: true, email: session.email, partner: await sessionPartner(session) });
  } catch {
    return res.status(401).json({ error: 'invalid_email_or_password' });
  }
});

app.post('/api/auth/sign-out', (_req, res) => {
  clearSession(res);
  return res.status(204).end();
});

app.get('/api/auth/me', async (req, res) => {
  const session = readSession(req);
  if (!session) return res.json({ authenticated: false, partner: null });
  try {
    return res.json({ authenticated: true, email: session.email, partner: await sessionPartner(session) });
  } catch (error) {
    return sendError(res, error);
  }
});

app.get('/api/live/dataset', async (req, res) => {
  try {
    const dataset = await loadLiveDataset(readSession(req));
    return res.json({ dataset });
  } catch (error) {
    return sendError(res, error);
  }
});

app.post('/api/live/bootstrap/scout', async (req, res) => {
  try {
    const partner = await bootstrapFirstScout(requireSession(req), req.body || {});
    return res.status(201).json({ partner, dataset: await loadLiveDataset(readSession(req)) });
  } catch (error) {
    return sendError(res, error);
  }
});

app.post('/api/live/scout/properties', async (req, res) => {
  try {
    const property = await createScoutProperty(requireSession(req), req.body || {});
    return res.status(201).json({ property, dataset: await loadLiveDataset(readSession(req)) });
  } catch (error) {
    return sendError(res, error);
  }
});

app.post('/api/live/enquiries', async (req, res) => {
  if (!publicEnquiryLimiter.allow(clientKey(req))) return res.status(429).json({ error: 'enquiry_rate_limited' });
  try {
    const enquiry = await createLiveEnquiry(req.body || {});
    return res.status(201).json({ enquiry });
  } catch (error) {
    return sendError(res, error);
  }
});

app.post('/api/live/enquiries/:id/advance', async (req, res) => {
  try {
    const enquiry = await advanceLiveEnquiry(requireSession(req), req.params.id, req.body || {});
    return res.json({ enquiry, dataset: await loadLiveDataset(readSession(req)) });
  } catch (error) {
    return sendError(res, error);
  }
});

app.post('/api/live/enquiries/:id/community-approval', async (req, res) => {
  try {
    const enquiry = await recordLiveCommunityApproval(requireSession(req), req.params.id, req.body?.evidenceReference);
    return res.json({ enquiry, dataset: await loadLiveDataset(readSession(req)) });
  } catch (error) {
    return sendError(res, error);
  }
});

app.post('/api/activepieces', async (req, res) => {
  if (!automationLimiter.allow(clientKey(req))) {
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
