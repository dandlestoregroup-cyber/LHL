import crypto from 'node:crypto';
import type { AtomicDocumentWrite } from './firestore-rest';
import { getDocument, listDocuments, replaceDocument } from './firestore-rest';

export type LiveOutboxType =
  | 'supply.lead_created'
  | 'supply.owner_consent_recorded'
  | 'supply.owner_assigned'
  | 'supply.operator_assigned'
  | 'supply.community_authority_assigned'
  | 'supply.assessment_scheduled'
  | 'supply.assessment_completed'
  | 'supply.owner_decision_recorded'
  | 'supply.property_live'
  | 'booking.enquiry_created'
  | 'booking.stage_changed'
  | 'booking.community_approval_recorded';

export interface LiveOutboxEvent {
  id: string;
  dataMode: 'live';
  synthetic: false;
  type: LiveOutboxType;
  aggregateType: 'property' | 'assessment' | 'owner_decision' | 'enquiry';
  aggregateId: string;
  occurredAt: string;
  payload: Record<string, unknown>;
  status: 'pending' | 'delivered';
  attempts: number;
  nextAttemptAt?: string;
  deliveredAt?: string;
  lastError?: string;
}

const COLLECTION = 'liveOutbox';

const stableId = (type: LiveOutboxType, aggregateId: string, occurredAt: string): string =>
  `evt_${crypto.createHash('sha256').update(`${type}\n${aggregateId}\n${occurredAt}`).digest('hex')}`;

export function liveOutboxWrite(
  type: LiveOutboxType,
  aggregateType: LiveOutboxEvent['aggregateType'],
  aggregateId: string,
  occurredAt: string,
  payload: Record<string, unknown>,
): AtomicDocumentWrite {
  const event: LiveOutboxEvent = {
    id: stableId(type, aggregateId, occurredAt),
    dataMode: 'live',
    synthetic: false,
    type,
    aggregateType,
    aggregateId,
    occurredAt,
    payload,
    status: 'pending',
    attempts: 0,
  };
  return {
    mode: 'create',
    collection: COLLECTION,
    id: event.id,
    data: event as unknown as Record<string, unknown>,
  };
}

const webhookConfig = (): { url: URL; secret: string } => {
  const rawUrl = process.env.ACTIVEPIECES_WEBHOOK_URL?.trim();
  const secret = process.env.ACTIVEPIECES_SHARED_SECRET?.trim();
  if (!rawUrl || !secret) throw new Error('live_automation_not_configured');
  const url = new URL(rawUrl);
  const localDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  if (url.protocol !== 'https:' && !(localDev && url.protocol === 'http:')) throw new Error('live_webhook_must_use_https');
  return { url, secret };
};

const retryDelayMs = (attempts: number): number => Math.min(60 * 60_000, 30_000 * 2 ** Math.min(attempts, 7));

export async function dispatchLiveOutboxEvent(id: string, now = new Date()): Promise<'delivered' | 'already_delivered' | 'retry_scheduled'> {
  const stored = await getDocument<LiveOutboxEvent>(COLLECTION, id);
  if (!stored) throw new Error('live_outbox_event_not_found');
  const event = stored.data;
  if (event.status === 'delivered') return 'already_delivered';
  if (event.nextAttemptAt && new Date(event.nextAttemptAt).getTime() > now.getTime()) return 'retry_scheduled';

  const { url, secret } = webhookConfig();
  const timestamp = now.getTime().toString();
  const body = JSON.stringify({
    version: 1,
    id: event.id,
    type: event.type,
    source: 'lhl-server',
    dataMode: 'live',
    synthetic: false,
    occurredAt: event.occurredAt,
    aggregateType: event.aggregateType,
    aggregateId: event.aggregateId,
    payload: event.payload,
  });
  const signature = crypto.createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-lhl-event-id': event.id,
        'x-lhl-idempotency-key': event.id,
        'x-lhl-timestamp': timestamp,
        'x-lhl-signature': `sha256=${signature}`,
        'x-lhl-simulation': 'false',
      },
      body,
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`upstream_${response.status}`);

    const deliveredAt = now.toISOString();
    const delivered: LiveOutboxEvent = {
      ...event,
      status: 'delivered',
      attempts: event.attempts + 1,
      deliveredAt,
      nextAttemptAt: undefined,
      lastError: undefined,
    };
    await replaceDocument(COLLECTION, id, delivered as unknown as Record<string, unknown>, stored.updateTime);
    return 'delivered';
  } catch (error) {
    const attempts = event.attempts + 1;
    const retry: LiveOutboxEvent = {
      ...event,
      attempts,
      nextAttemptAt: new Date(now.getTime() + retryDelayMs(attempts)).toISOString(),
      lastError: error instanceof Error ? error.message.slice(0, 180) : 'delivery_failed',
    };
    await replaceDocument(COLLECTION, id, retry as unknown as Record<string, unknown>, stored.updateTime).catch(() => undefined);
    return 'retry_scheduled';
  }
}

export async function drainLiveOutbox(limit = 20, now = new Date()): Promise<{ checked: number; delivered: number; retryScheduled: number }> {
  const safeLimit = Math.max(1, Math.min(50, Math.floor(limit)));
  const events = (await listDocuments<LiveOutboxEvent>(COLLECTION))
    .map((item) => item.data)
    .filter((event) => event.dataMode === 'live' && !event.synthetic && event.status === 'pending')
    .filter((event) => !event.nextAttemptAt || new Date(event.nextAttemptAt).getTime() <= now.getTime())
    .sort((a, b) => a.occurredAt.localeCompare(b.occurredAt))
    .slice(0, safeLimit);

  let delivered = 0;
  let retryScheduled = 0;
  for (const event of events) {
    const result = await dispatchLiveOutboxEvent(event.id, now);
    if (result === 'delivered' || result === 'already_delivered') delivered += 1;
    else retryScheduled += 1;
  }
  return { checked: events.length, delivered, retryScheduled };
}
