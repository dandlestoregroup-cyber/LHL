import assert from 'node:assert/strict';
import { evaluateStayIntake } from './mastermind';
import type { Enquiry, Property } from '../types';

const mockLiveProperty: Property = {
  id: 'prop-azure-azha',
  slug: 'azure-haven-azha',
  name: 'Azure Haven at AZHA',
  nameAr: 'أزور هافن في أزها',
  location: 'AZHA, Ain Sokhna',
  locationAr: 'أزها، العين السخنة',
  supplyStage: 'live',
  sealIssued: true,
  nightlyFloorEgp: 6000,
  payoutReady: true,
  maxGuests: 6,
  calendarAuthority: 'little_hut',
  bookingMode: 'request',
  communityApprovalRequired: true,
  heroImage: '/moments/01-slow-morning.jpg',
  galleryImages: [],
  provenMoments: [
    { key: 'slow_morning' as any, title: 'Slow Morning', titleAr: 'صباح هادئ' },
    { key: 'barefoot_afternoon' as any, title: 'Barefoot Afternoon', titleAr: 'ظهيرة حافية القدمين' },
  ],
};

const quotedEnquiry: Enquiry = {
  id: 'enq-quoted',
  propertyId: mockLiveProperty.id,
  guestName: 'Kareem Tarek',
  checkIn: '2026-09-15',
  checkOut: '2026-09-18',
  adults: 2,
  children: 1,
  stage: 'quoted',
  quote: {
    nightlyRateEgp: 6500,
    nights: 3,
    accommodationEgp: 19500,
    feesEgp: 1500,
    totalEgp: 21000,
    issuedAt: '2026-09-09T12:00:00.000Z',
  },
};

// 1. Governed quote is used exactly; community approval still requires human authority.
const result1 = evaluateStayIntake(
  {
    requestedMoment: 'slow_morning',
    checkIn: '2026-09-15',
    checkOut: '2026-09-18',
    adults: 2,
    children: 1,
    guestName: 'Kareem Tarek',
  },
  mockLiveProperty,
  undefined,
  undefined,
  [quotedEnquiry],
);
assert.equal(result1.decisionVersion, 'MASTERMIND-POLICY-2026.2');
assert.equal(result1.inputsUsed.nights, 3);
assert.equal(result1.inputsUsed.partySize, 3);
assert.equal(result1.decision, 'require_human_review');
assert.equal(result1.overrideAuthorityRequired, 'community_authority');
assert.equal(result1.commercialSummary?.source, 'operator_quote');
assert.equal(result1.commercialSummary?.totalEgp, 21000);
assert.equal(result1.commercialSummary?.nightlyRateEgp, 6500);

// 2. Invalid stay dates block.
const result2 = evaluateStayIntake(
  { requestedMoment: 'slow_morning', checkIn: '2026-09-20', checkOut: '2026-09-18', adults: 2, children: 0 },
  mockLiveProperty,
);
assert.equal(result2.decision, 'block');

// 3. Party size exceeding capacity blocks.
const result3 = evaluateStayIntake(
  { requestedMoment: 'slow_morning', checkIn: '2026-09-15', checkOut: '2026-09-18', adults: 8, children: 2 },
  mockLiveProperty,
);
assert.equal(result3.decision, 'block');

// 4. Unsealed property blocks.
const result4 = evaluateStayIntake(
  { requestedMoment: 'slow_morning', checkIn: '2026-09-15', checkOut: '2026-09-18', adults: 2, children: 0 },
  { ...mockLiveProperty, supplyStage: 'activation_ready', sealIssued: false },
);
assert.equal(result4.decision, 'block');

// 5. An active hold for different dates must not falsely block this request.
const differentDatesHold: Enquiry = {
  id: 'enq-other-dates',
  propertyId: mockLiveProperty.id,
  guestName: 'Other Guest',
  checkIn: '2026-09-25',
  checkOut: '2026-09-28',
  adults: 2,
  children: 0,
  stage: 'hold',
  hold: { active: true, expiresAt: '2099-01-01T00:00:00.000Z' },
};
const result5 = evaluateStayIntake(
  { requestedMoment: 'slow_morning', checkIn: '2026-09-15', checkOut: '2026-09-18', adults: 2, children: 0 },
  mockLiveProperty,
  undefined,
  undefined,
  [differentDatesHold, quotedEnquiry],
);
assert.notEqual(result5.chainSteps.find((step) => step.stepIndex === 5)?.status, 'failed');

// 6. An overlapping active hold must block.
const overlappingHold: Enquiry = {
  ...differentDatesHold,
  id: 'enq-overlap',
  checkIn: '2026-09-16',
  checkOut: '2026-09-19',
};
const result6 = evaluateStayIntake(
  { requestedMoment: 'slow_morning', checkIn: '2026-09-15', checkOut: '2026-09-18', adults: 2, children: 0 },
  mockLiveProperty,
  undefined,
  undefined,
  [overlappingHold, quotedEnquiry],
);
assert.equal(result6.chainSteps.find((step) => step.stepIndex === 5)?.status, 'failed');
assert.equal(result6.decision, 'block');

// 7. Without a governed quote, Mastermind escalates instead of inventing commercial numbers.
const result7 = evaluateStayIntake(
  { requestedMoment: 'slow_morning', checkIn: '2026-10-01', checkOut: '2026-10-04', adults: 2, children: 0 },
  { ...mockLiveProperty, communityApprovalRequired: false },
);
assert.equal(result7.commercialSummary, undefined);
assert.equal(result7.chainSteps.find((step) => step.stepIndex === 10)?.status, 'warning');
assert.equal(result7.decision, 'require_human_review');

console.log('mastermind truth reconciliation self-test: ok');
