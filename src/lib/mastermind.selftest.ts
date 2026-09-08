import assert from 'node:assert/strict';
import { evaluateStayIntake } from './mastermind';
import type { Property } from '../types';

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

// Test 1: Valid Live request with community approval requirement routes to require_human_review (governed request)
const result1 = evaluateStayIntake(
  {
    requestedMoment: 'slow_morning',
    checkIn: '2026-09-15',
    checkOut: '2026-09-18',
    adults: 2,
    children: 1,
    guestName: 'Kareem Tarek',
  },
  mockLiveProperty
);

assert.equal(result1.decisionVersion, 'MASTERMIND-POLICY-2026.1');
assert.equal(result1.inputsUsed.nights, 3);
assert.equal(result1.inputsUsed.partySize, 3);
assert.equal(result1.decision, 'require_human_review', 'Community approval property routes to require_human_review');
assert.equal(result1.overrideAuthorityRequired, 'community_authority');
assert.ok(result1.commercialSummary?.totalEgp && result1.commercialSummary.totalEgp > 18000);

// Test 2: Invalid stay dates blocks
const result2 = evaluateStayIntake(
  {
    requestedMoment: 'slow_morning',
    checkIn: '2026-09-20',
    checkOut: '2026-09-18',
    adults: 2,
    children: 0,
  },
  mockLiveProperty
);
assert.equal(result2.decision, 'block', 'Reversed stay dates must be blocked by Mastermind');

// Test 3: Party size exceeding capacity blocks
const result3 = evaluateStayIntake(
  {
    requestedMoment: 'slow_morning',
    checkIn: '2026-09-15',
    checkOut: '2026-09-18',
    adults: 8,
    children: 2,
  },
  mockLiveProperty
);
assert.equal(result3.decision, 'block', 'Party exceeding capacity must be blocked');

// Test 4: Unsealed property blocks
const unsealedProp: Property = {
  ...mockLiveProperty,
  supplyStage: 'activation_ready',
  sealIssued: false,
};
const result4 = evaluateStayIntake(
  {
    requestedMoment: 'slow_morning',
    checkIn: '2026-09-15',
    checkOut: '2026-09-18',
    adults: 2,
    children: 0,
  },
  unsealedProp
);
assert.equal(result4.decision, 'block', 'Unsealed property must be blocked from stay confirmation');

console.log('mastermind truth reconciliation self-test: ok');
