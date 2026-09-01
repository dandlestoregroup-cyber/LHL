/**
 * Little Hut Core Self-Test Suite (lh-core.selftest.mjs)
 * Canonical 49-test suite verifying the logic authority.
 */

import {
  evaluateEvidence,
  publicCardFacts,
  canTakeMoney,
  resolveBookingMode,
  evaluateStandard,
  evaluateLaunchAuthority,
  evaluateAuditLadder,
  qualifyGuestRequest,
  processCalendarEntry,
  LIFECYCLE_STATES,
  AUDIT_LEVELS
} from './lh-core.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ok   ${message}`);
    passed++;
  } else {
    console.error(`  FAIL ${message}`);
    failed++;
  }
}

console.log('Evidence ceiling');
{
  const res1 = evaluateEvidence('listing', 'slow_morning');
  assert(res1.canProve === false, 'a listing cannot prove a moment');
  assert(res1.downgraded === true, 'the downgrade is reported');

  const res2 = evaluateEvidence('site_visit', 'slow_morning');
  assert(res2.canProve === true, 'a site visit can');
}

console.log('\nThe public card has two states');
{
  const sealedHome = { lifecycle: LIFECYCLE_STATES.SEALED, publiclyAnnounced: false };
  const sealedFacts = publicCardFacts(sealedHome);
  assert(sealedFacts.visible === false, 'a sealed home is not automatically shown');

  const shortlistedHome = { lifecycle: LIFECYCLE_STATES.SHORTLISTED };
  const shortFacts = publicCardFacts(shortlistedHome);
  assert(shortFacts.visible === true && shortFacts.state === 'joining', 'a shortlisted home shows as joining');

  const liveHome = { lifecycle: LIFECYCLE_STATES.LIVE, sealIssued: true, reviews: [{ r: 5 }, { r: 5 }, { r: 5 }], avgRating: 4.9 };
  const liveFacts = publicCardFacts(liveHome);
  assert(liveFacts.isVerified === true, 'only a live home is verified');

  const suspendedHome = { lifecycle: LIFECYCLE_STATES.SUSPENDED };
  assert(publicCardFacts(suspendedHome).visible === false, 'a suspended home is never shown');

  assert(shortFacts.bookable === false, 'a joining card is not bookable');
  assert(shortFacts.showSeal === false, 'a joining card carries no seal');
  assert(shortFacts.hasAvailabilityClaim === false, 'a joining card makes no availability claim');
  assert(shortFacts.showRate === false && liveFacts.showRate === false, 'no card ever shows a rate');

  const liveWithoutReviews = { lifecycle: LIFECYCLE_STATES.LIVE, sealIssued: true, reviews: [] };
  assert(publicCardFacts(liveWithoutReviews).rating === null, 'a rating needs real reviews');
}

console.log('\nMoney');
{
  const unverified = { lifecycle: LIFECYCLE_STATES.SHORTLISTED };
  const config = { rateFloor: 500, payoutAccountConfigured: true };
  assert(canTakeMoney(unverified, config).allowed === false, 'an unverified home takes no money');

  const liveNoFloor = { lifecycle: LIFECYCLE_STATES.LIVE };
  assert(canTakeMoney(liveNoFloor, { rateFloor: 0, payoutAccountConfigured: true }).allowed === false, 'no floor, no money');

  const liveOk = { lifecycle: LIFECYCLE_STATES.LIVE };
  assert(canTakeMoney(liveOk, { rateFloor: 600, payoutAccountConfigured: true }).allowed === true, 'a live configured home may');
}

console.log('\nBooking mode envelope');
{
  const subCtx = { calendarAuthority: 'subscribed', requestedInstant: true, littleHutHoldsCalendar: false };
  assert(resolveBookingMode(subCtx).instantAllowed === false, 'instant dies on a subscribed calendar');

  const unkCtx = { calendarAuthority: 'unknown', requestedInstant: true };
  assert(resolveBookingMode(unkCtx).instantAllowed === false, 'unknown authority is treated as subscribed');

  const commCtx = { calendarAuthority: 'lh_direct', communityApprovalRequired: true, littleHutHoldsCalendar: true, requestedInstant: true };
  assert(resolveBookingMode(commCtx).instantAllowed === false, 'community approval kills instant');

  const lhCtx = { calendarAuthority: 'lh_direct', communityApprovalRequired: false, littleHutHoldsCalendar: true, requestedInstant: true };
  assert(resolveBookingMode(lhCtx).instantAllowed === true, 'instant survives where Little Hut holds the calendar');

  const fallback = resolveBookingMode(subCtx);
  assert(fallback.fallbackReported === true, 'the fallback is never silent');

  const standardReq = { calendarAuthority: 'lh_direct', littleHutHoldsCalendar: true, requestedInstant: false };
  assert(resolveBookingMode(standardReq).mode === 'request', 'nothing upgrades request into instant');
}

console.log('\nThe standard');
{
  const badTrust = {
    trustGates: [{ id: 't1', status: 'failed' }],
    shieldChecks: [{ id: 's1', status: 'passed' }],
    littleHutHourChecked: true,
    provenMomentsCount: 2
  };
  assert(evaluateStandard(badTrust).passed === false, 'a failed TRUST gate disqualifies');

  const pendingGate = {
    trustGates: [{ id: 't1', status: 'pending' }],
    shieldChecks: [{ id: 's1', status: 'passed' }],
    littleHutHourChecked: true,
    provenMomentsCount: 2
  };
  assert(evaluateStandard(pendingGate).passed === false, 'a pending gate waits');

  const noHour = {
    trustGates: Array(6).fill({ status: 'passed' }),
    shieldChecks: Array(6).fill({ status: 'passed' }),
    littleHutHourChecked: false,
    provenMomentsCount: 2
  };
  assert(evaluateStandard(noHour).passed === false, 'a home with no Little Hut hour fails whatever it scores');

  const oneMoment = {
    trustGates: Array(6).fill({ status: 'passed' }),
    shieldChecks: Array(6).fill({ status: 'passed' }),
    littleHutHourChecked: true,
    provenMomentsCount: 1
  };
  assert(evaluateStandard(oneMoment).passed === false, 'two proven moments is a real property');

  const badShield = {
    trustGates: Array(6).fill({ status: 'passed' }),
    shieldChecks: [{ status: 'failed' }, ...Array(5).fill({ status: 'passed' })],
    littleHutHourChecked: true,
    provenMomentsCount: 2
  };
  assert(evaluateStandard(badShield).passed === false, 'one SHIELD fail blocks');

  const allClear = {
    trustGates: Array(6).fill({ status: 'passed' }),
    shieldChecks: Array(6).fill({ status: 'passed' }),
    littleHutHourChecked: true,
    provenMomentsCount: 2
  };
  assert(evaluateStandard(allClear).passed === true, 'all six clear');

  const pendingShield = {
    trustGates: Array(6).fill({ status: 'passed' }),
    shieldChecks: [{ status: 'pending' }, ...Array(5).fill({ status: 'passed' })],
    littleHutHourChecked: true,
    provenMomentsCount: 2
  };
  assert(evaluateStandard(pendingShield).sealAllowed === false, 'no seal while SHIELD is unresolved');

  const poolFail = {
    trustGates: Array(6).fill({ status: 'passed' }),
    shieldChecks: [{ id: 'pool_fence', status: 'failed' }, ...Array(5).fill({ status: 'passed' })],
    littleHutHourChecked: true,
    provenMomentsCount: 2
  };
  assert(evaluateStandard(poolFail).passed === false, 'a spotless kitchen does not offset an unfenced pool');

  assert(evaluateStandard(allClear).sealAllowed === true, 'seal when both are good');
}

console.log('\nLaunch authority');
{
  const sealedWithoutDecision = { sealIssued: true, ownerDecision: null };
  assert(evaluateLaunchAuthority(sealedWithoutDecision).canGoLive === false, 'a sealed home is not live');

  const silentDecision = { sealIssued: true, ownerDecision: null };
  assert(evaluateLaunchAuthority(silentDecision).canGoLive === false, 'silence is not approval');

  const noNameDate = { sealIssued: true, ownerDecision: { approved: true } };
  assert(evaluateLaunchAuthority(noNameDate).canGoLive === false, 'a decision needs a name and a date');

  const openConditions = {
    sealIssued: true,
    ownerDecision: { approved: true, approvedByName: 'Tarek El-Amir', approvedAtDate: '2026-08-20', conditions: [{ resolved: false }] }
  };
  assert(evaluateLaunchAuthority(openConditions).canGoLive === false, 'approval with open conditions is not approval');

  const cleanDecision = {
    sealIssued: true,
    ownerDecision: { approved: true, approvedByName: 'Tarek El-Amir', approvedAtDate: '2026-08-20', conditions: [] }
  };
  assert(evaluateLaunchAuthority(cleanDecision).canGoLive === true, 'a clean approval authorises live');

  const nonBlockingDep = {
    sealIssued: true,
    ownerDecision: { approved: true, approvedByName: 'Tarek El-Amir', approvedAtDate: '2026-08-20' },
    dependencies: [{ name: 'art_catalog', launch_blocking: false, resolved: false }]
  };
  assert(evaluateLaunchAuthority(nonBlockingDep).canGoLive === true, 'an open dependency changes the forecast, not the state');

  const blockingDep = {
    sealIssued: true,
    ownerDecision: { approved: true, approvedByName: 'Tarek El-Amir', approvedAtDate: '2026-08-20' },
    dependencies: [{ name: 'lock_installation', launch_blocking: true, resolved: false }]
  };
  assert(evaluateLaunchAuthority(blockingDep).canGoLive === false, 'a launch_blocking dependency does block');
}

console.log('\nAudit ladder');
{
  assert(evaluateAuditLadder([]).level === AUDIT_LEVELS.NEW, 'every home starts at New');

  const twoClean = [
    { status: 'clean', holdingOutcome: true },
    { status: 'clean', holdingOutcome: true }
  ];
  assert(evaluateAuditLadder(twoClean).level === AUDIT_LEVELS.STEADY, 'two clean audits earn Steady');

  const fourClean = [
    { status: 'clean', holdingOutcome: true },
    { status: 'clean', holdingOutcome: true },
    { status: 'clean', holdingOutcome: true },
    { status: 'clean', holdingOutcome: true }
  ];
  assert(evaluateAuditLadder(fourClean).level === AUDIT_LEVELS.PROVEN, 'four clean plus holding outcomes earn Proven');

  const triggerAudit = [
    ...fourClean,
    { status: 'incident', holdingOutcome: false, triggerEvent: true }
  ];
  assert(evaluateAuditLadder(triggerAudit).level === AUDIT_LEVELS.NEW, 'a trigger snaps it back the same day');
}

console.log('\nGuest qualification');
{
  const overCap = { partySize: 8, isEvent: false };
  const rules = { maxCapacity: 4, calendarAuthority: 'lh_direct', bookingMode: 'request' };
  assert(qualifyGuestRequest(overCap, rules).hardDecline === true, 'over capacity is a hard decline');

  const eventReq = { partySize: 4, isEvent: true };
  assert(qualifyGuestRequest(eventReq, rules).hardDecline === true, 'an event is a hard decline');

  const cleanSubscribed = { partySize: 2, isEvent: false };
  const subRules = { maxCapacity: 4, calendarAuthority: 'subscribed', bookingMode: 'instant' };
  assert(qualifyGuestRequest(cleanSubscribed, subRules).routedTo === 'request', 'a clean enquiry on a subscribed calendar still lands on request');

  const instantRules = { maxCapacity: 4, calendarAuthority: 'lh_direct', bookingMode: 'instant' };
  const cleanInstant = { partySize: 2, isEvent: false };
  assert(qualifyGuestRequest(cleanInstant, instantRules).qualified === true, 'qualification runs even in instant mode');
}

console.log('\nCalendar');
{
  assert(processCalendarEntry('enquiry', {}).blocksCalendar === false, 'an enquiry does not block a calendar');
  assert(processCalendarEntry('quote', {}).blocksCalendar === false, 'a quote does not block a calendar');
  assert(processCalendarEntry('hold', { expiresAt: '2026-08-28T18:00:00Z' }).blocksCalendar === true, 'a hold does');
  assert(processCalendarEntry('hold', {}).blocksCalendar === false, 'a hold without an expiry is refused');
}

console.log(`\n${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
