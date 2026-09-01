/**
 * Little Hut Core Domain Logic (lh-core.js)
 * Authoritative implementation of Little Hut Business Standards,
 * Evidence Ceilings, Booking Modes, Audit Ladder, and Authority Matrix.
 */

export const MOMENTS = {
  SLOW_MORNING: 'slow_morning',
  LONG_TABLE: 'long_table',
  AFTERNOON_DRIFT: 'afternoon_drift',
  NIGHT_SWIM: 'night_swim',
  FIRE_CONVERSATION: 'fire_conversation',
  SILENT_READING: 'silent_reading',
};

export const LIFECYCLE_STATES = {
  SHORTLISTED: 'shortlisted',
  SEALED: 'sealed',
  LIVE: 'live',
  MONITORED: 'monitored',
  SUSPENDED: 'suspended',
  OFFLINE: 'offline',
};

export const AUDIT_LEVELS = {
  NEW: 'New',
  STEADY: 'Steady',
  PROVEN: 'Proven',
};

export const EVIDENCE_TYPES = {
  LISTING: 'listing',
  PHOTO: 'photo',
  SITE_VISIT: 'site_visit',
  AUDIT: 'audit',
  SENSOR: 'sensor',
};

/**
 * 1. Evidence Ceiling: Determines whether evidence can prove a moment
 */
export function evaluateEvidence(evidenceType, targetClaim) {
  if (evidenceType === EVIDENCE_TYPES.LISTING || evidenceType === 'listing_text') {
    return {
      canProve: false,
      downgraded: true,
      reason: 'A listing cannot prove a moment. Requires physical verification.',
      level: 'unverified'
    };
  }
  if (evidenceType === EVIDENCE_TYPES.SITE_VISIT || evidenceType === EVIDENCE_TYPES.AUDIT) {
    return {
      canProve: true,
      downgraded: false,
      reason: 'Physical inspection completed.',
      level: 'proven'
    };
  }
  return {
    canProve: false,
    downgraded: true,
    reason: 'Insufficient evidence level.',
    level: 'pending'
  };
}

/**
 * 2. Public Card Facts: Evaluates public card state and restrictions
 */
export function publicCardFacts(property) {
  const isLive = property.lifecycle === LIFECYCLE_STATES.LIVE || property.lifecycle === LIFECYCLE_STATES.MONITORED;
  const isShortlisted = property.lifecycle === LIFECYCLE_STATES.SHORTLISTED;
  const isSuspended = property.lifecycle === LIFECYCLE_STATES.SUSPENDED || property.lifecycle === LIFECYCLE_STATES.OFFLINE;
  const isSealed = property.lifecycle === LIFECYCLE_STATES.SEALED;

  if (isSuspended) {
    return {
      visible: false,
      state: 'hidden',
      isVerified: false,
      bookable: false,
      showSeal: false,
      showRate: false,
      hasAvailabilityClaim: false
    };
  }

  if (isSealed && !property.publiclyAnnounced) {
    return {
      visible: false,
      state: 'sealed_pending_launch',
      isVerified: false,
      bookable: false,
      showSeal: false,
      showRate: false,
      hasAvailabilityClaim: false
    };
  }

  if (isShortlisted) {
    return {
      visible: true,
      state: 'joining',
      badge: 'Joining Little Hut',
      isVerified: false,
      bookable: false,
      showSeal: false,
      showRate: false,
      hasAvailabilityClaim: false,
      rating: null
    };
  }

  if (isLive) {
    const hasRealReviews = property.reviews && property.reviews.length >= 3;
    return {
      visible: true,
      state: 'live',
      badge: 'Verified Little Hut Home',
      isVerified: true,
      bookable: true,
      showSeal: property.sealIssued === true,
      showRate: false, // Rule: No card ever shows a rate
      hasAvailabilityClaim: true,
      rating: hasRealReviews ? property.avgRating : null
    };
  }

  return {
    visible: false,
    state: 'hidden',
    isVerified: false,
    bookable: false,
    showSeal: false,
    showRate: false,
    hasAvailabilityClaim: false
  };
}

/**
 * 3. Money / Financial configuration rules
 */
export function canTakeMoney(property, config) {
  if (property.lifecycle !== LIFECYCLE_STATES.LIVE && property.lifecycle !== LIFECYCLE_STATES.MONITORED) {
    return { allowed: false, reason: 'An unverified home takes no money.' };
  }
  if (!config || typeof config.rateFloor !== 'number' || config.rateFloor <= 0) {
    return { allowed: false, reason: 'No floor, no money.' };
  }
  if (!config.payoutAccountConfigured) {
    return { allowed: false, reason: 'Missing payout destination.' };
  }
  return { allowed: true, reason: 'Live and configured home authorized for transactions.' };
}

/**
 * 4. Booking Mode Envelope
 */
export function resolveBookingMode(propertyContext) {
  const { calendarAuthority, communityApprovalRequired, littleHutHoldsCalendar, requestedInstant } = propertyContext;

  // Rule: Instant dies on a subscribed calendar
  if (calendarAuthority === 'subscribed' || calendarAuthority === 'external') {
    return {
      mode: 'request',
      instantAllowed: false,
      reason: 'Instant dies on a subscribed calendar.',
      fallbackReported: true
    };
  }

  // Rule: Unknown authority is treated as subscribed
  if (!calendarAuthority || calendarAuthority === 'unknown') {
    return {
      mode: 'request',
      instantAllowed: false,
      reason: 'Unknown authority is treated as subscribed.',
      fallbackReported: true
    };
  }

  // Rule: Community approval kills instant
  if (communityApprovalRequired) {
    return {
      mode: 'request',
      instantAllowed: false,
      reason: 'Community approval kills instant.',
      fallbackReported: true
    };
  }

  // Rule: Instant survives where Little Hut holds the calendar
  if (littleHutHoldsCalendar && requestedInstant) {
    return {
      mode: 'instant',
      instantAllowed: true,
      reason: 'Little Hut holds calendar and all authority criteria met.',
      fallbackReported: false
    };
  }

  // Rule: Nothing upgrades request into instant automatically
  return {
    mode: 'request',
    instantAllowed: false,
    reason: 'Standard request mode envelope active.',
    fallbackReported: false
  };
}

/**
 * 5. The Standard (TRUST, PROOF, SHIELD & Seal)
 */
export function evaluateStandard(assessment) {
  const { trustGates, provenMomentsCount, shieldChecks, littleHutHourChecked } = assessment;

  // Rule: A failed TRUST gate disqualifies
  if (trustGates && trustGates.some(g => g.status === 'failed')) {
    return { passed: false, sealAllowed: false, reason: 'A failed TRUST gate disqualifies.' };
  }

  // Rule: A pending gate waits
  if (trustGates && trustGates.some(g => g.status === 'pending')) {
    return { passed: false, sealAllowed: false, reason: 'A pending gate waits.' };
  }

  // Rule: A home with no Little Hut hour fails whatever it scores
  if (!littleHutHourChecked) {
    return { passed: false, sealAllowed: false, reason: 'A home with no Little Hut hour fails whatever it scores.' };
  }

  // Rule: Two proven moments is a real property
  if (!provenMomentsCount || provenMomentsCount < 2) {
    return { passed: false, sealAllowed: false, reason: 'Requires at least two proven moments.' };
  }

  // Rule: One SHIELD fail blocks (A spotless kitchen does not offset an unfenced pool)
  const shieldFailed = shieldChecks && shieldChecks.some(s => s.status === 'failed');
  if (shieldFailed) {
    return { passed: false, sealAllowed: false, reason: 'One SHIELD fail blocks. A spotless kitchen does not offset an unfenced pool.' };
  }

  const shieldPending = shieldChecks && shieldChecks.some(s => s.status === 'pending');
  if (shieldPending) {
    return { passed: false, sealAllowed: false, reason: 'No seal while SHIELD is unresolved.' };
  }

  const allSixTrustClear = trustGates && trustGates.length >= 6 && trustGates.every(g => g.status === 'passed');
  const shieldAllClear = shieldChecks && shieldChecks.length >= 6 && shieldChecks.every(s => s.status === 'passed');

  if (allSixTrustClear && shieldAllClear && littleHutHourChecked && provenMomentsCount >= 2) {
    return { passed: true, sealAllowed: true, reason: 'Seal when both are good. All gates clear.' };
  }

  return { passed: false, sealAllowed: false, reason: 'Assessment criteria incomplete.' };
}

/**
 * 6. Launch Authority
 */
export function evaluateLaunchAuthority(launchPayload) {
  const { sealIssued, ownerDecision, dependencies } = launchPayload;

  // Rule: A sealed home is not live
  if (!ownerDecision) {
    return { canGoLive: false, reason: 'A sealed home is not live. Silence is not approval.' };
  }

  // Rule: A decision needs a name and a date
  if (!ownerDecision.approvedByName || !ownerDecision.approvedAtDate) {
    return { canGoLive: false, reason: 'A decision needs a name and a date.' };
  }

  // Rule: Approval with open conditions is not approval
  if (ownerDecision.conditions && ownerDecision.conditions.some(c => !c.resolved)) {
    return { canGoLive: false, reason: 'Approval with open conditions is not approval.' };
  }

  // Rule: An open dependency changes the forecast, not the state, UNLESS launch_blocking
  if (dependencies && dependencies.some(d => d.launch_blocking && !d.resolved)) {
    return { canGoLive: false, reason: 'A launch_blocking dependency does block.' };
  }

  if (sealIssued && ownerDecision.approved === true) {
    return { canGoLive: true, reason: 'A clean approval authorises live.' };
  }

  return { canGoLive: false, reason: 'Launch conditions not met.' };
}

/**
 * 7. Audit Ladder
 */
export function evaluateAuditLadder(auditHistory) {
  if (!auditHistory || auditHistory.length === 0) {
    return { level: AUDIT_LEVELS.NEW, auditCount: 0 };
  }

  // Rule: A trigger snaps it back the same day
  const hasTrigger = auditHistory.some(a => a.triggerEvent || a.incidentTriggered);
  if (hasTrigger) {
    return { level: AUDIT_LEVELS.NEW, triggerApplied: true, reason: 'A trigger snaps it back the same day.' };
  }

  const cleanAudits = auditHistory.filter(a => a.status === 'clean' && a.holdingOutcome === true);

  if (cleanAudits.length >= 4) {
    return { level: AUDIT_LEVELS.PROVEN, auditCount: cleanAudits.length };
  }

  if (cleanAudits.length >= 2) {
    return { level: AUDIT_LEVELS.STEADY, auditCount: cleanAudits.length };
  }

  return { level: AUDIT_LEVELS.NEW, auditCount: cleanAudits.length };
}

/**
 * 8. Guest Qualification
 */
export function qualifyGuestRequest(enquiry, propertyRules) {
  // Rule: Over capacity is a hard decline
  if (enquiry.partySize > propertyRules.maxCapacity) {
    return { qualified: false, hardDecline: true, reason: 'Over capacity is a hard decline.' };
  }

  // Rule: An event is a hard decline
  if (enquiry.isEvent || enquiry.purpose === 'event' || enquiry.purpose === 'party') {
    return { qualified: false, hardDecline: true, reason: 'An event is a hard decline.' };
  }

  // Rule: Qualification runs even in instant mode
  // Rule: A clean enquiry on a subscribed calendar still lands on request
  const isClean = enquiry.partySize <= propertyRules.maxCapacity && !enquiry.isEvent;
  const targetMode = propertyRules.calendarAuthority === 'subscribed' ? 'request' : (propertyRules.bookingMode || 'request');

  return {
    qualified: isClean,
    hardDecline: false,
    routedTo: targetMode,
    reason: propertyRules.calendarAuthority === 'subscribed' ? 'A clean enquiry on a subscribed calendar still lands on request.' : 'Qualified.'
  };
}

/**
 * 9. Calendar Holds & Blocks
 */
export function processCalendarEntry(entryType, payload) {
  if (entryType === 'enquiry') {
    return { blocksCalendar: false, reason: 'An enquiry does not block a calendar.' };
  }
  if (entryType === 'quote') {
    return { blocksCalendar: false, reason: 'A quote does not block a calendar.' };
  }
  if (entryType === 'hold') {
    if (!payload || !payload.expiresAt) {
      return { blocksCalendar: false, error: 'A hold without an expiry is refused.' };
    }
    return { blocksCalendar: true, expiresAt: payload.expiresAt, reason: 'A hold blocks the calendar until expiry.' };
  }
  return { blocksCalendar: false, reason: 'Unknown entry type.' };
}
