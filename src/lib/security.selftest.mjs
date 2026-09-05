import fs from 'node:fs';
import { AuthorityMatrix } from './authority-matrix.runtime.mjs';

let passed = 0;
const assert = (condition, message) => {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`ok  ${message}`);
  passed += 1;
};

const property = { supplyStage: 'live', sealIssued: true, nightlyFloorEgp: 6000, payoutReady: true, communityApprovalRequired: true };
const activeHold = { active: true, expiresAt: '2026-09-04T12:00:00.000Z' };
const enquiry = {
  quote: { nightlyRateEgp: 6500 }, hold: activeHold, payment: { receivedAt: '2026-09-01T10:00:00.000Z' },
  communityApproval: { status: 'approved', authorityPartnerId: 'community-1', evidenceReference: 'APP-1' },
};
const now = new Date('2026-09-01T12:00:00.000Z');

assert(!AuthorityMatrix.can('scout', 'write_assessment').allowed, 'scout cannot write assessment');
assert(!AuthorityMatrix.can('operator', 'submit_owner_decision').allowed, 'operator cannot fabricate owner decision');
assert(!AuthorityMatrix.can('owner', 'write_assessment').allowed, 'owner cannot assess own property');
assert(!AuthorityMatrix.can('assessor', 'issue_quote').allowed, 'assessor cannot quote');
assert(!AuthorityMatrix.can('operator', 'issue_community_approval').allowed, 'operator cannot issue community approval');
assert(AuthorityMatrix.can('community_authority', 'issue_community_approval').allowed, 'community authority owns approval decision');
assert(!AuthorityMatrix.canIssueQuote('operator', property, 5900).allowed, 'operator cannot quote below owner floor');
assert(AuthorityMatrix.canIssueQuote('operator', property, 6000).allowed, 'operator may quote at owner floor');
assert(!AuthorityMatrix.canPlaceHold('operator', '2026-08-31T12:00:00.000Z', now).allowed, 'operator cannot create expired hold');
assert(!AuthorityMatrix.canConfirm('owner', property, enquiry, now).allowed, 'owner cannot execute confirmation');
assert(AuthorityMatrix.canConfirm('operator', property, enquiry, now).allowed, 'operator can confirm after payment, hold, and approval');

const firestoreRules = fs.readFileSync(new URL('../../firestore.rules', import.meta.url), 'utf8');
assert(firestoreRules.includes("affectedKeys().hasOnly([\n        'updatedAt',\n        'activationChecklistComplete',\n        'calendarAuthority'"), 'Firestore limits operator property writes to operational fields');
assert(!firestoreRules.includes('request.resource.data.nightlyFloorEgp == resource.data.nightlyFloorEgp'), 'Firestore no longer uses the broad operator property-update bypass');
assert(firestoreRules.includes('allowedBookingTransition('), 'Firestore enquiry updates are gated by an explicit transition function');
assert(firestoreRules.includes("fromStage == 'received' && toStage == 'qualified'"), 'Firestore starts booking progression at received to qualified');
assert(!firestoreRules.includes("fromStage == 'received' && toStage == 'confirmed'"), 'Firestore has no received-to-confirmed shortcut');
assert(firestoreRules.includes("fromStage == 'payment_pending' && toStage == 'payment_received'"), 'Firestore requires the payment stage transition');
assert(firestoreRules.includes("prop.payoutReady == true"), 'Firestore requires payout readiness before payment_received');
assert(firestoreRules.includes('communityApproved(data, prop)'), 'Firestore confirmation path requires recorded community evidence where applicable');
assert(firestoreRules.includes("property(request.resource.data.propertyId).sealIssued == true"), 'Firestore public enquiry creation requires a sealed Live property');

console.log(`\n${passed} authority rules passed`);
