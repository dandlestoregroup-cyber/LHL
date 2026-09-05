import assert from 'node:assert/strict';
import {
  AutomationIngressError,
  createDemoAutomationGuard,
  createFixedWindowRateLimiter,
} from './automation-gateway';

const now = new Date('2026-09-05T06:00:00.000Z');
const guard = createDemoAutomationGuard();

const created = guard.prepare({
  type: 'enquiry.created',
  dataMode: 'demo',
  id: 'attacker-controlled-id',
  source: 'forged-source',
  synthetic: false,
  payload: {
    enquiryId: 'demo-enquiry-1788588000000',
    propertyId: 'property-seaward-library',
    guestName: 'Demo Guest',
    guestPhoneMasked: '+20 ••• •• 1111',
    checkIn: '2026-09-12',
    checkOut: '2026-09-15',
    adults: 2,
    children: 1,
    requestedMoment: 'slow_morning',
  },
}, now);

assert.equal(created.event.source, 'lhl-web');
assert.equal(created.event.synthetic, true);
assert.equal(created.event.dataMode, 'demo');
assert.equal(created.event.occurredAt, now.toISOString());
assert.notEqual(created.event.id, 'attacker-controlled-id');
created.commit();

const stageChange = guard.prepare({
  type: 'enquiry.stage_changed',
  dataMode: 'demo',
  payload: {
    enquiryId: 'demo-enquiry-1788588000000',
    propertyId: 'property-seaward-library',
    fromStage: 'received',
    toStage: 'qualified',
  },
}, now);
assert.equal(stageChange.event.payload.toStage, 'qualified');
stageChange.commit();

assert.throws(
  () => guard.prepare({
    type: 'enquiry.stage_changed',
    dataMode: 'demo',
    payload: {
      enquiryId: 'demo-enquiry-1788588000000',
      propertyId: 'property-seaward-library',
      fromStage: 'received',
      toStage: 'confirmed',
    },
  }, now),
  (error: unknown) => error instanceof AutomationIngressError && error.code === 'untrusted_enquiry_state',
);

assert.throws(
  () => guard.prepare({
    type: 'enquiry.created',
    dataMode: 'live',
    payload: {},
  }, now),
  (error: unknown) => error instanceof AutomationIngressError && error.code === 'invalid_or_live_event',
);

assert.throws(
  () => guard.prepare({
    type: 'enquiry.created',
    dataMode: 'demo',
    payload: {
      enquiryId: 'demo-enquiry-1788588000001',
      propertyId: 'property-dune-house',
      guestName: 'Forged Guest',
      guestPhoneMasked: '+20 ••• •• 2222',
      checkIn: '2026-09-12',
      checkOut: '2026-09-15',
      adults: 2,
      children: 0,
      requestedMoment: 'slow_morning',
    },
  }, now),
  (error: unknown) => error instanceof AutomationIngressError && error.code === 'untrusted_demo_property',
);

const approval = guard.prepare({
  type: 'community_approval.recorded',
  dataMode: 'demo',
  payload: {
    enquiryId: 'enquiry-08-community_approval_pending',
    propertyId: 'property-azure-haven',
    authorityPartnerId: 'partner-community-azha',
    evidenceReference: 'DEMO-COMMUNITY-1788588000000',
  },
}, now);
approval.commit();

const afterApproval = guard.prepare({
  type: 'enquiry.stage_changed',
  dataMode: 'demo',
  payload: {
    enquiryId: 'enquiry-08-community_approval_pending',
    propertyId: 'property-azure-haven',
    fromStage: 'community_approved',
    toStage: 'confirmed',
  },
}, now);
assert.equal(afterApproval.event.payload.toStage, 'confirmed');

const limiter = createFixedWindowRateLimiter(2, 1000);
assert.equal(limiter.allow('client-a', 1000), true);
assert.equal(limiter.allow('client-a', 1100), true);
assert.equal(limiter.allow('client-a', 1200), false);
assert.equal(limiter.allow('client-a', 2000), true);
assert.equal(limiter.allow('client-b', 1200), true);

console.log('automation gateway self-test: ok');
