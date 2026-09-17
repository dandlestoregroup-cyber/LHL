import assert from 'node:assert/strict';
import {
  deriveOperatorFactory,
  normalizeOperatorWorkspaceInput,
  parsePortfolioCsv,
  previewPortfolioRows,
  type OperatorPortfolioCandidate,
  type OperatorWorkspace,
} from './operator-workspace';
import type { OperatingDataset } from '../types';

const validRow = {
  external_property_id: 'HOME-001',
  property_name: 'Sea Home',
  country: 'Egypt',
  region: 'Ain Sokhna',
  location_label: 'Azha',
  owner_reference: 'OWNER-001',
};

const workspaceInput = {
  organisationName: 'Example Operator',
  country: 'Egypt',
  currency: 'EGP',
  timezone: 'Africa/Cairo',
  operatingModel: 'fully_managed' as const,
  bookingModel: 'both' as const,
  calendarModel: 'mixed' as const,
  assignmentMode: 'skill_based' as const,
  housekeepingModel: 'mixed' as const,
  maintenanceModel: 'vendor' as const,
  pricingMandate: 'operator_within_mandate' as const,
  communityApprovalDefault: true,
  notificationChannels: ['email', 'whatsapp'] as Array<'email' | 'whatsapp'>,
};

{
  const normalized = normalizeOperatorWorkspaceInput(workspaceInput);
  assert.equal(normalized.currency, 'EGP');
  assert.equal(normalized.targets?.monthlyGrossBookingValueEgp, undefined, 'targets must not be invented');
}

{
  const rows = parsePortfolioCsv('external_property_id,property_name,country,region,location_label,owner_reference\nHOME-001,"Sea, Home",Egypt,Ain Sokhna,Azha,OWNER-001');
  assert.equal(rows[0].property_name, 'Sea, Home');
}

{
  const preview = previewPortfolioRows([{ ...validRow, moment_under_stars: 'yes' }]);
  assert.equal(preview.acceptedRows, 1);
  assert.equal(preview.rows[0].provenance, 'reported');
  assert.equal(preview.rows[0].reportedMomentCandidates[0].momentId, 'under_stars');
  assert.equal(preview.rows[0].reportedMomentCandidates[0].resolvedState, 'unknown', 'portfolio upload must never certify a Moment');
}

{
  const duplicate = previewPortfolioRows([validRow, { ...validRow, property_name: 'Duplicate' }]);
  assert.equal(duplicate.rows[1].status, 'rejected');
  const existing = previewPortfolioRows([validRow], ['HOME-001']);
  assert.equal(existing.rows[0].status, 'needs_review');
  assert.match(existing.rows[0].nextAction, /No automatic overwrite/i);
}

{
  const invalid = previewPortfolioRows([{ ...validRow, owner_reference: '' }]);
  assert.equal(invalid.rejectedRows, 1);
  assert.match(invalid.rows[0].issues.join(' '), /owner_reference/);
}

{
  const now = '2026-09-17T10:00:00.000Z';
  const workspace: OperatorWorkspace = {
    ...normalizeOperatorWorkspaceInput({ ...workspaceInput, targets: { monthlyGrossBookingValueEgp: 100000, liveHomes: 2 } }),
    id: 'op-1', dataMode: 'live', synthetic: false, operatorPartnerId: 'op-1', version: 1, createdAt: now, updatedAt: now,
  };
  const dataset: OperatingDataset = {
    mode: 'live', label: 'Live', labelAr: 'فعلي', asOf: now, partners: [], assessments: [], ownerDecisions: [],
    properties: [{ id: 'p-1', slug: 'p-1', name: 'Home 1', nameAr: 'بيت ١', location: 'Azha', locationAr: 'أزهى', supplyStage: 'live', publiclyVisible: true, sealIssued: true, operatorPartnerId: 'op-1', maxGuests: 4, bedroomCount: 2, calendarAuthority: 'little_hut', bookingMode: 'request', communityApprovalRequired: false, payoutReady: true, activationChecklistComplete: true, heroImage: '', galleryImages: [], provenMoments: [] }],
    enquiries: [{ id: 'e-1', propertyId: 'p-1', guestName: 'Guest', stage: 'confirmed', updatedAt: now, quote: { nightlyRateEgp: 10000, nights: 2, accommodationEgp: 20000, feesEgp: 0, totalEgp: 20000, issuedAt: now }, readinessCheck: { status: 'pending' } }],
  };
  const candidate: OperatorPortfolioCandidate = {
    id: 'c-1', dataMode: 'live', synthetic: false, workspaceId: 'op-1', operatorPartnerId: 'op-1', importId: 'i-1', sourceName: 'portfolio.csv', externalPropertyId: 'HOME-002', propertyName: 'Home 2', propertyNameAr: 'Home 2', country: 'Egypt', region: 'Ain Sokhna', locationLabel: 'Azha', locationLabelAr: 'Azha', ownerReference: 'OWNER-002', operatingModel: 'fully_managed', provenance: 'reported', reportedMomentCandidates: [], unsupportedSourceFields: {}, status: 'ready_for_sourcing', nextAction: 'Route to sourcing', createdAt: now, updatedAt: now,
  };
  const factory = deriveOperatorFactory(dataset, workspace, [candidate], new Date(now));
  assert.equal(factory.metrics.securedBookingValueEgp, 20000);
  assert.equal(factory.metrics.arrivalReadinessAtRisk, 1);
  assert.ok(factory.items.some((item) => item.priority === 'critical' && item.title.includes('Arrival readiness')));
  assert.ok(factory.items.some((item) => item.candidateId === 'c-1' && item.owner === 'scout'));
  assert.ok(factory.items.some((item) => item.id === 'target-gbv-gap'));
}

console.log('operator workspace self-test passed');
