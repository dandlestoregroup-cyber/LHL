/** Locked Little Hut domain rules. Keep in sync with docs/operating-doctrine.md. */

export const MOMENTS = Object.freeze({
  SLOW_MORNING: 'slow_morning',
  LONG_TABLE: 'long_table',
  AFTERNOON_DRIFT: 'afternoon_drift',
  NIGHT_SWIM: 'night_swim',
  FIRE_CONVERSATION: 'fire_conversation',
  SILENT_READING: 'silent_reading',
});

export const MOMENT_KEYS = Object.freeze(Object.values(MOMENTS));

export const SUPPLY_STAGES = Object.freeze([
  'sourced',
  'owner_engaged',
  'assessment_scheduled',
  'decision_pending',
  'activation_ready',
  'live',
  'paused',
  'declined',
]);

export const BOOKING_SPINE = Object.freeze([
  'received',
  'qualified',
  'availability_checked',
  'quoted',
  'hold',
  'payment_pending',
  'payment_received',
  'community_approval_pending',
  'community_approved',
  'confirmed',
  'completed',
]);

export const TERMINAL_ENQUIRY_STAGES = Object.freeze(['declined', 'expired', 'cancelled']);

export function evaluateEvidence(evidenceType) {
  if (evidenceType === 'site_visit' || evidenceType === 'independent_assessment') {
    return { canProve: true, level: 'proven', reason: 'Physical independent evidence can prove a Moment.' };
  }
  return {
    canProve: false,
    level: evidenceType === 'listing' || evidenceType === 'owner_claim' ? 'nominated' : 'pending',
    reason: 'Listings, owner claims, and scout notes may nominate but cannot prove a Moment.',
  };
}

export function publicPropertyFacts(property) {
  const isLive = property.supplyStage === 'live';
  const isJoining = property.joiningVisible && !isLive && !['paused', 'declined'].includes(property.supplyStage);
  return {
    publicHome: Boolean(isLive && property.publiclyVisible && property.sealIssued),
    joining: Boolean(isJoining),
    bookable: Boolean(isLive && property.publiclyVisible && property.sealIssued),
    showSeal: Boolean(isLive && property.sealIssued),
    showRate: false,
  };
}

export function evaluateRateFloor(property, nightlyRateEgp) {
  if (!property || typeof property.nightlyFloorEgp !== 'number' || property.nightlyFloorEgp <= 0) {
    return { allowed: false, reason: 'No valid owner floor; quoting and payment are blocked.' };
  }
  if (!Number.isFinite(nightlyRateEgp) || nightlyRateEgp < property.nightlyFloorEgp) {
    return { allowed: false, reason: 'Quoted nightly accommodation rate is below the owner floor.' };
  }
  return { allowed: true, reason: 'Quote respects the owner floor.' };
}

export function isHoldActive(hold, at = new Date()) {
  if (!hold?.active || !hold.expiresAt) return false;
  return new Date(hold.expiresAt).getTime() > new Date(at).getTime();
}

export function canTakeMoney(property, enquiry, at = new Date()) {
  if (property.supplyStage !== 'live' || !property.sealIssued) {
    return { allowed: false, reason: 'Only a sealed Live home can take money.' };
  }
  if (!property.payoutReady) return { allowed: false, reason: 'Payout destination is not ready.' };
  const floorCheck = evaluateRateFloor(property, enquiry.quote?.nightlyRateEgp);
  if (!floorCheck.allowed) return floorCheck;
  if (!isHoldActive(enquiry.hold, at)) return { allowed: false, reason: 'Payment requires an active expiring hold.' };
  return { allowed: true, reason: 'Payment gates satisfied.' };
}

export function resolveBookingMode(property) {
  if (property.calendarAuthority !== 'little_hut') {
    return { mode: 'request', instantAllowed: false, reason: 'External or unknown calendar authority requires request mode.' };
  }
  if (property.communityApprovalRequired) {
    return { mode: 'request', instantAllowed: false, reason: 'Community approval is a hard gate and disables instant confirmation.' };
  }
  return property.bookingMode === 'instant'
    ? { mode: 'instant', instantAllowed: true, reason: 'Little Hut holds the calendar and no external approval gate applies.' }
    : { mode: 'request', instantAllowed: false, reason: 'Owner chose request mode.' };
}

export function calendarEffect(enquiry, at = new Date()) {
  const blockingStages = ['hold', 'payment_pending', 'payment_received', 'community_approval_pending', 'community_approved', 'confirmed'];
  if (!blockingStages.includes(enquiry.stage)) {
    return { blocksCalendar: false, reason: 'Only an active hold or confirmed stay blocks the calendar.' };
  }
  if (enquiry.stage === 'confirmed') return { blocksCalendar: true, reason: 'Confirmed stay blocks the calendar.' };
  return isHoldActive(enquiry.hold, at)
    ? { blocksCalendar: true, reason: 'Active hold blocks until expiry.' }
    : { blocksCalendar: false, reason: 'Missing or expired hold cannot block the calendar.' };
}

export function evaluateAssessment(assessment) {
  if (!assessment?.independenceConfirmed) return { passed: false, reason: 'Independent assessor confirmation is required.' };
  if (assessment.trustGates?.some((gate) => gate.status !== 'passed')) return { passed: false, reason: 'Every TRUST gate must pass.' };
  if (assessment.shieldGates?.some((gate) => gate.status !== 'passed')) return { passed: false, reason: 'Every SHIELD gate must pass.' };
  if ((assessment.provenMomentKeys?.length || 0) < 2) return { passed: false, reason: 'At least two canonical Moments must be proven.' };
  return { passed: true, reason: 'Independent assessment gate passed.' };
}

export function evaluateGoLive(property, assessment, ownerDecision) {
  const assessmentCheck = evaluateAssessment(assessment);
  if (!assessmentCheck.passed) return { allowed: false, reason: assessmentCheck.reason };
  if (!ownerDecision || ownerDecision.decision !== 'go' || !ownerDecision.decidedAt) {
    return { allowed: false, reason: 'Explicit named owner go decision is required.' };
  }
  if (ownerDecision.conditions?.some((item) => item.launchBlocking && !item.resolved)) {
    return { allowed: false, reason: 'An unresolved launch-blocking owner condition remains.' };
  }
  if (!ownerDecision.payoutReady || !ownerDecision.nightlyFloorEgp || ownerDecision.nightlyFloorEgp <= 0) {
    return { allowed: false, reason: 'Owner floor and payout readiness are required.' };
  }
  if (property.calendarAuthority === 'unknown') return { allowed: false, reason: 'Calendar authority must be explicit.' };
  if (!property.activationChecklistComplete) return { allowed: false, reason: 'Activation checklist is incomplete.' };
  return { allowed: true, reason: 'All Live gates satisfied.' };
}

export function canConfirmStay(property, enquiry, at = new Date()) {
  if (property.supplyStage !== 'live') return { allowed: false, reason: 'Property is not Live.' };
  if (!enquiry.payment?.receivedAt) return { allowed: false, reason: 'Payment is not recorded.' };
  if (!isHoldActive(enquiry.hold, at)) return { allowed: false, reason: 'Hold is missing or expired.' };
  if (property.communityApprovalRequired && enquiry.communityApproval?.status !== 'approved') {
    return { allowed: false, reason: 'Community approval is required before confirmation.' };
  }
  return { allowed: true, reason: 'Payment, hold, and approval gates satisfied.' };
}

export function assertDatasetBoundary(dataset) {
  const records = [dataset.partners, dataset.properties, dataset.assessments, dataset.ownerDecisions, dataset.enquiries].flat();
  const mismatched = records.filter((record) => record.dataMode !== dataset.mode || record.synthetic !== (dataset.mode === 'demo'));
  return {
    valid: mismatched.length === 0,
    mismatchedIds: mismatched.map((record) => record.id),
    reason: mismatched.length === 0 ? 'Dataset boundary is intact.' : 'A record crossed the Demo/Live boundary.',
  };
}
