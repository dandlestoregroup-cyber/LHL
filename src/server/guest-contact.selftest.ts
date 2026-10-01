import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createLiveEnquiry, loadLiveDataset } from './live-store';
import type { LiveSession } from './session-auth';

// In-memory provider responses only; no external requests or persisted fixtures.
const key = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey;
process.env.FIREBASE_PRIVATE_KEY = key.export({ type: 'pkcs8', format: 'pem' }).toString();
process.env.FIREBASE_PROJECT_ID = 'lhl-isolated-test';
process.env.FIREBASE_SERVICE_ACCOUNT_EMAIL = 'fixture@lhl-isolated-test.invalid';
const record = { dataMode: 'live', synthetic: false };
const home = { ...record, id: 'home-1', slug: 'home-one', supplyStage: 'live', publiclyVisible: true, sealIssued: true,
  ownerPartnerId: 'owner-1', operatorPartnerId: 'operator-1', maxGuests: 4, provenMoments: [{ key: 'slow_morning' }] };
const entries: Record<string, any[]> = {
  properties: [home], assessments: [], ownerDecisions: [], enquiries: [],
  partners: ['owner', 'operator', 'scout'].map(role => ({ ...record, id: `${role}-1`, role, status: 'active' })),
};
const field = (value: any): any => value === null || value === undefined ? { nullValue: null } : typeof value === 'string' ? { stringValue: value } : typeof value === 'boolean' ? { booleanValue: value }
  : typeof value === 'number' ? { integerValue: String(value) } : Array.isArray(value) ? { arrayValue: { values: value.map(field) } }
  : { mapValue: { fields: Object.fromEntries(Object.entries(value).map(([k,v]) => [k,field(v)])) } };
const document = (data: any) => ({ fields: field(data).mapValue.fields, updateTime: '2026-10-01T00:00:00Z' });
let writes: any[] = [];
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = new URL(String(input));
  if (url.hostname === 'oauth2.googleapis.com') return Response.json({ access_token: 'isolated-test-token', expires_in: 3600 });
  assert.equal(url.hostname, 'firestore.googleapis.com');
  if (url.pathname.endsWith(':commit')) { writes = JSON.parse(String(init?.body)).writes; return Response.json({ writeResults: writes.map(() => ({ updateTime: '2026-10-01T00:00:00Z' })) }); }
  const parts = url.pathname.split('/');
  const tail = parts.at(-1)!;
  if (entries[tail]) return Response.json({ documents: entries[tail].map(document) });
  const data = entries[parts.at(-2)!]?.find(item => item.id === tail);
  return data ? Response.json(document(data)) : new Response('', { status: 404 });
};
try {
  const receipt = await createLiveEnquiry({ propertyId: 'home-1', guestName: 'Isolated Test Guest', guestPhone: '+20 (100) 000-0000',
    guestPhoneMasked: 'forged mask', checkIn: '2026-11-01', checkOut: '2026-11-03', adults: 2, children: 0, requestedMoment: 'slow_morning' });
  assert.equal(receipt.guestPhone, undefined);
  assert.equal(receipt.guestPhoneMasked, '•••• 0000');
  const stored = writes.find(write => write.update.name.endsWith(`/enquiries/${receipt.id}`));
  assert.equal(stored.update.fields.guestPhone.stringValue, '+201000000000');
  const event = writes.find(write => write.update.name.includes('/liveOutbox/'));
  assert(!JSON.stringify(event).includes('+201000000000'), 'outbox excludes full contact');
  entries.enquiries = [{ ...receipt, guestPhone: '+201000000000' }];
  const session = (uid: string) => ({ uid } as LiveSession);
  assert.equal((await loadLiveDataset()).enquiries.length, 0);
  assert.equal((await loadLiveDataset(session('owner-1'))).enquiries[0].guestPhone, undefined);
  assert.equal((await loadLiveDataset(session('operator-1'))).enquiries[0].guestPhone, '+201000000000');
  assert.equal((await loadLiveDataset(session('scout-1'))).enquiries.length, 0);
  entries.partners.push({ ...record, id: 'operator-other', role: 'operator', status: 'active' });
  entries.partners.push({ ...record, id: 'operator-revoked', role: 'operator', status: 'revoked' });
  assert.equal((await loadLiveDataset(session('operator-other'))).enquiries.length, 0, 'unassigned operator cannot read guest contact');
  assert.equal((await loadLiveDataset(session('operator-revoked'))).enquiries.length, 0, 'revoked operator cannot read guest contact');
  const legacyReceipt = await createLiveEnquiry({ propertyId: 'home-1', guestName: 'Legacy Test', guestPhoneMasked: '+201000000000',
    checkIn: '2026-11-01', checkOut: '2026-11-03', adults: 2, children: 0, requestedMoment: 'slow_morning' });
  assert.equal(legacyReceipt.guestPhoneMasked, '•••• 0000');
  assert.equal(legacyReceipt.guestPhone, undefined, 'old clients cannot expose raw contact in the public receipt');
  entries.properties.push({ ...home, id: 'withdrawn', supplyStage: 'paused', joiningVisible: true });
  assert(!(await loadLiveDataset()).properties.some(item => item.id === 'withdrawn'));
  await assert.rejects(createLiveEnquiry({ propertyId: 'home-1', guestName: 'Test', guestPhone: 'invalid', checkIn: '2026-11-01', checkOut: '2026-11-03', adults: 2, children: 0, requestedMoment: 'slow_morning' }), /invalid_guest_phone/);
  (home.provenMoments[0] as any).level = 'nominated';
  await assert.rejects(createLiveEnquiry({ propertyId: 'home-1', guestName: 'Test', guestPhone: '+201000000000', checkIn: '2026-11-01', checkOut: '2026-11-03', adults: 2, children: 0, requestedMoment: 'slow_morning' }), /unproven_moment/);
} finally { globalThis.fetch = originalFetch; }
console.log('guest contact: private write, redacted receipt/outbox and four-role scope checks passed');
