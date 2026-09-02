import {
  BOOKING_SPINE,
  MOMENT_KEYS,
  SUPPLY_STAGES,
  assertDatasetBoundary,
  calendarEffect,
  canConfirmStay,
  canTakeMoney,
  evaluateAssessment,
  evaluateEvidence,
  evaluateGoLive,
  evaluateRateFloor,
  publicPropertyFacts,
  resolveBookingMode,
} from './lh-core.js';

let passed = 0;
const assert = (condition, message) => {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`ok  ${message}`);
  passed += 1;
};

assert(MOMENT_KEYS.length === 6 && new Set(MOMENT_KEYS).size === 6, 'six exact canonical Moments are locked');
assert(SUPPLY_STAGES.join('|') === 'sourced|owner_engaged|assessment_scheduled|decision_pending|activation_ready|live|paused|declined', 'supply stages are locked');
assert(BOOKING_SPINE[0] === 'received' && BOOKING_SPINE.at(-1) === 'completed', 'booking spine runs received to completed');
assert(!evaluateEvidence('listing').canProve, 'listing cannot prove a Moment');
assert(!evaluateEvidence('owner_claim').canProve, 'owner claim cannot prove a Moment');
assert(evaluateEvidence('independent_assessment').canProve, 'independent assessment can prove a Moment');

const liveProperty = {
  supplyStage: 'live', publiclyVisible: true, joiningVisible: false, sealIssued: true,
  nightlyFloorEgp: 6000, payoutReady: true, calendarAuthority: 'little_hut', bookingMode: 'instant',
  communityApprovalRequired: false, activationChecklistComplete: true,
};
assert(publicPropertyFacts(liveProperty).bookable, 'sealed public Live property is bookable');
assert(!publicPropertyFacts({ ...liveProperty, supplyStage: 'activation_ready' }).bookable, 'activation-ready property is not bookable');
assert(!publicPropertyFacts(liveProperty).showRate, 'public cards never expose a rate');
assert(!evaluateRateFloor(liveProperty, 5999).allowed, 'below-floor quote is rejected');
assert(evaluateRateFloor(liveProperty, 6000).allowed, 'quote at floor is accepted');

const activeHold = { active: true, expiresAt: '2026-09-04T12:00:00.000Z' };
const paidEnquiry = { stage: 'payment_received', quote: { nightlyRateEgp: 6500 }, hold: activeHold, payment: { receivedAt: '2026-09-01T10:00:00.000Z' }, communityApproval: { status: 'not_required' } };
const now = new Date('2026-09-01T12:00:00.000Z');
assert(canTakeMoney(liveProperty, paidEnquiry, now).allowed, 'money gate accepts floor, payout, and active hold');
assert(!canTakeMoney(liveProperty, { ...paidEnquiry, hold: { active: true, expiresAt: '2026-08-31T12:00:00.000Z' } }, now).allowed, 'expired hold blocks payment');
assert(calendarEffect({ stage: 'quoted' }, now).blocksCalendar === false, 'quote does not block calendar');
assert(calendarEffect({ stage: 'hold', hold: activeHold }, now).blocksCalendar === true, 'active expiring hold blocks calendar');
assert(resolveBookingMode({ ...liveProperty, communityApprovalRequired: true }).instantAllowed === false, 'community approval disables instant');
assert(resolveBookingMode({ ...liveProperty, calendarAuthority: 'external' }).instantAllowed === false, 'external calendar disables instant');

const gates = Array.from({ length: 6 }, (_, index) => ({ key: `${index}`, status: 'passed' }));
const assessment = { independenceConfirmed: true, trustGates: gates, shieldGates: gates, provenMomentKeys: ['slow_morning', 'long_table'] };
assert(evaluateAssessment(assessment).passed, 'independent all-clear assessment with two Moments passes');
assert(!evaluateAssessment({ ...assessment, independenceConfirmed: false }).passed, 'non-independent assessment fails');
assert(!evaluateAssessment({ ...assessment, provenMomentKeys: ['slow_morning'] }).passed, 'one proven Moment fails');

const ownerDecision = { decision: 'go', decidedAt: '2026-08-30', payoutReady: true, nightlyFloorEgp: 6000, conditions: [] };
assert(evaluateGoLive(liveProperty, assessment, ownerDecision).allowed, 'complete assessment and owner mandate allow Live');
assert(!evaluateGoLive(liveProperty, assessment, { ...ownerDecision, decision: 'defer' }).allowed, 'defer decision blocks Live');

const communityProperty = { ...liveProperty, communityApprovalRequired: true };
assert(!canConfirmStay(communityProperty, { ...paidEnquiry, communityApproval: { status: 'pending' } }, now).allowed, 'pending community approval blocks confirmation after payment');
assert(canConfirmStay(communityProperty, { ...paidEnquiry, communityApproval: { status: 'approved' } }, now).allowed, 'approved community gate permits confirmation');

const cleanDemo = { mode: 'demo', partners: [{ id: 'd1', dataMode: 'demo', synthetic: true }], properties: [], assessments: [], ownerDecisions: [], enquiries: [] };
assert(assertDatasetBoundary(cleanDemo).valid, 'clean Demo dataset boundary passes');
assert(!assertDatasetBoundary({ ...cleanDemo, properties: [{ id: 'leak', dataMode: 'live', synthetic: false }] }).valid, 'Live record leaking into Demo is rejected');

console.log(`\n${passed} core rules passed`);
