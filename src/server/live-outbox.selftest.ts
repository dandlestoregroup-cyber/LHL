import assert from 'node:assert/strict';
import fs from 'node:fs';
import { deriveLiveOutboxRecord } from './live-outbox-record';

const enquiry = {
  id: 'live-enquiry-1',
  dataMode: 'live',
  synthetic: false,
  createdAt: '2026-09-05T08:00:00.000Z',
  updatedAt: '2026-09-05T08:01:00.000Z',
  propertyId: 'live-property-1',
  stage: 'payment_received',
  guestName: 'Private Guest',
  guestPhoneMasked: '+20 private',
  payment: { amountEgp: 12345, reference: 'PRIVATE-PAYMENT-REFERENCE' },
  communityApproval: { status: 'pending', evidenceReference: 'PRIVATE-APPROVAL' },
};

const first = deriveLiveOutboxRecord('replaced', 'enquiries', enquiry.id, enquiry);
const second = deriveLiveOutboxRecord('replaced', 'enquiries', enquiry.id, enquiry);
assert(first, 'Live business write derives an outbox record');
assert.equal(first?.id, second?.id, 'same committed state derives the same idempotency key');
const serialized = JSON.stringify(first?.data || {});
assert(!serialized.includes('Private Guest'), 'outbox does not contain guest name');
assert(!serialized.includes('+20 private'), 'outbox does not contain guest phone');
assert(!serialized.includes('PRIVATE-PAYMENT-REFERENCE'), 'outbox does not contain payment reference');
assert(!serialized.includes('PRIVATE-APPROVAL'), 'outbox does not contain community evidence reference');
assert(serialized.includes('payment_received'), 'outbox contains the operational stage needed for orchestration');

assert.equal(deriveLiveOutboxRecord('created', 'properties', 'demo', {
  dataMode: 'demo', synthetic: true, createdAt: '2026-09-05T08:00:00.000Z', supplyStage: 'sourced',
}), null, 'Demo records never enter the Live outbox');

const propertyEvent = deriveLiveOutboxRecord('replaced', 'properties', 'live-property-1', {
  dataMode: 'live',
  synthetic: false,
  updatedAt: '2026-09-05T08:02:00.000Z',
  supplyStage: 'live',
  publiclyVisible: true,
  sealIssued: true,
  communityApprovalRequired: true,
  ownerConsentReference: 'PRIVATE-CONSENT-REFERENCE',
  nightlyFloorEgp: 99999,
});
const propertySerialized = JSON.stringify(propertyEvent?.data || {});
assert(!propertySerialized.includes('PRIVATE-CONSENT-REFERENCE'), 'outbox does not contain owner consent evidence');
assert(!propertySerialized.includes('99999'), 'outbox does not expose owner commercial floor');
assert(propertySerialized.includes('"sealIssued":true'), 'outbox records the system seal state');

const firestoreSource = fs.readFileSync(new URL('./firestore-rest.ts', import.meta.url), 'utf8');
const outboxSource = fs.readFileSync(new URL('./live-outbox.ts', import.meta.url), 'utf8');
const serverSource = fs.readFileSync(new URL('../../server.ts', import.meta.url), 'utf8');

assert(firestoreSource.includes('withDerivedOutbox'), 'persistence layer automatically derives Live outbox records');
assert(firestoreSource.includes("collection: 'liveOutbox'"), 'outbox record is part of the Firestore commit writes');
assert(firestoreSource.includes('await commitRaw(withDerivedOutbox(writes))'), 'multi-record business commits append outbox records atomically');
assert(outboxSource.includes("'x-lhl-idempotency-key': event.id"), 'delivery publishes a stable idempotency key');
assert(outboxSource.includes("'x-lhl-simulation': 'false'"), 'Live deliveries cannot be confused with Demo simulation');
assert(outboxSource.includes('retryDelayMs'), 'failed deliveries receive bounded exponential retry scheduling');
assert(serverSource.includes("app.post('/api/internal/live-outbox/drain'"), 'server exposes an internal outbox drain endpoint');
assert(serverSource.includes("req.headers['x-lhl-outbox-secret']"), 'drain endpoint requires the dedicated secret header');
assert(serverSource.includes('crypto.timingSafeEqual'), 'drain secret comparison is timing-safe');

console.log('live outbox self-test: ok');
