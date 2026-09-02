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

console.log(`\n${passed} authority rules passed`);
