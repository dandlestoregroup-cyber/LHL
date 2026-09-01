import { BOOKING_SPINE, MOMENT_KEYS, SUPPLY_STAGES, assertDatasetBoundary, evaluateGoLive } from '../lib/lh-core';
import { DEMO_DATASET } from './demo';
import { LIVE_DATASET } from './live';

let passed = 0;
const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`ok  ${message}`);
  passed += 1;
};

assert(assertDatasetBoundary(DEMO_DATASET).valid, 'every Demo record is synthetic and Demo-scoped');
assert(assertDatasetBoundary(LIVE_DATASET).valid, 'Live boundary accepts the truth-only empty dataset');
assert(['partners', 'properties', 'assessments', 'ownerDecisions', 'enquiries'].every((key) => (LIVE_DATASET[key as keyof typeof LIVE_DATASET] as unknown[]).length === 0), 'Live starts with no business records');
assert(SUPPLY_STAGES.every((stage: string) => DEMO_DATASET.properties.some((property) => property.supplyStage === stage)), 'mature Demo covers every supply stage');
assert(BOOKING_SPINE.every((stage: string) => DEMO_DATASET.enquiries.some((enquiry) => enquiry.stage === stage)), 'mature Demo covers every booking-spine stage');
assert(['owner', 'scout', 'operator', 'assessor', 'community_authority'].every((role) => DEMO_DATASET.partners.some((partner) => partner.role === role)), 'mature Demo covers every Partner authority');
assert(MOMENT_KEYS.every((moment: string) => DEMO_DATASET.properties.some((property) => property.provenMoments.some((item) => item.key === moment))), 'mature Demo uses all six exact Moments');

const ids = new Set(DEMO_DATASET.partners.map((partner) => partner.id));
assert(DEMO_DATASET.properties.every((property) => ids.has(property.scoutPartnerId)), 'every Demo property has a valid Scout relation');
assert(DEMO_DATASET.assessments.every((assessment) => ids.has(assessment.assessorPartnerId)), 'every Demo assessment has a valid independent Assessor relation');

const liveHomes = DEMO_DATASET.properties.filter((property) => property.supplyStage === 'live');
assert(liveHomes.every((property) => {
  const assessment = DEMO_DATASET.assessments.find((item) => item.propertyId === property.id);
  const decision = DEMO_DATASET.ownerDecisions.find((item) => item.propertyId === property.id);
  return evaluateGoLive(property, assessment, decision).allowed;
}), 'every public Demo home satisfies the complete Live gate');

assert(DEMO_DATASET.enquiries.some((enquiry) => enquiry.stage === 'community_approval_pending'), 'Demo includes a pending community-approval case');
assert(DEMO_DATASET.enquiries.some((enquiry) => enquiry.stage === 'community_approved' && enquiry.communityApproval?.evidenceReference), 'Demo includes an approved community case with evidence');
assert(DEMO_DATASET.enquiries.some((enquiry) => enquiry.payment?.receivedAt), 'Demo includes recorded payments');
assert(DEMO_DATASET.enquiries.some((enquiry) => enquiry.hold?.active), 'Demo includes active holds');

console.log(`\n${passed} operating dataset checks passed`);
