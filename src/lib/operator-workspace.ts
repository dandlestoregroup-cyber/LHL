import { CANONICAL_FLAGSHIP_MOMENTS, type CanonicalFlagshipMomentId } from '../data/canonicalMomentsRegistry';
import type { Enquiry, OperatingDataset, Property } from '../types';

export type OperatorOperatingModel = 'fully_managed' | 'supported' | 'owner_operated';
export type OperatorBookingModel = 'request' | 'instant' | 'both';
export type OperatorCalendarModel = 'little_hut' | 'external' | 'mixed';
export type OperatorAssignmentMode = 'fixed_property_owner' | 'region_pool' | 'skill_based' | 'shift_based' | 'round_robin' | 'manual';
export type OperatorHousekeepingModel = 'in_house' | 'vendor' | 'mixed';
export type OperatorMaintenanceModel = 'in_house' | 'vendor' | 'mixed';

export interface OperatorTargets {
  monthlyGrossBookingValueEgp?: number;
  liveHomes?: number;
  enquiryResponseMinutes?: number;
}

export interface OperatorWorkspaceInput {
  organisationName: string;
  country: string;
  currency: string;
  timezone: string;
  operatingModel: OperatorOperatingModel;
  bookingModel: OperatorBookingModel;
  calendarModel: OperatorCalendarModel;
  assignmentMode: OperatorAssignmentMode;
  housekeepingModel: OperatorHousekeepingModel;
  maintenanceModel: OperatorMaintenanceModel;
  pricingMandate: 'owner_floor_only' | 'operator_within_mandate' | 'owner_approval_required';
  communityApprovalDefault: boolean;
  notificationChannels: Array<'email' | 'whatsapp' | 'sms'>;
  targets?: OperatorTargets;
}

export interface OperatorWorkspace extends OperatorWorkspaceInput {
  id: string;
  dataMode: 'live';
  synthetic: false;
  operatorPartnerId: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export type PortfolioRowStatus = 'accepted' | 'needs_review' | 'rejected';
export type PortfolioCandidateStatus = 'ready_for_sourcing' | 'needs_review' | 'converted' | 'dismissed';

export interface PortfolioSourceRow extends Record<string, unknown> {
  external_property_id?: unknown;
  property_name?: unknown;
  property_name_ar?: unknown;
  country?: unknown;
  region?: unknown;
  location_label?: unknown;
  location_label_ar?: unknown;
  owner_reference?: unknown;
  operating_model?: unknown;
}

export interface ReportedMomentCandidate {
  momentId: CanonicalFlagshipMomentId;
  reportedValue: string;
  provenance: 'reported';
  resolvedState: 'unknown';
}

export interface PortfolioPreviewRow {
  rowNumber: number;
  status: PortfolioRowStatus;
  externalPropertyId: string | null;
  propertyName: string | null;
  issues: string[];
  warnings: string[];
  provenance: 'reported';
  reportedMomentCandidates: ReportedMomentCandidate[];
  unsupportedSourceFields: Record<string, unknown>;
  nextAction: string;
  normalized?: {
    externalPropertyId: string;
    propertyName: string;
    propertyNameAr: string;
    country: string;
    region: string;
    locationLabel: string;
    locationLabelAr: string;
    ownerReference: string;
    operatingModel?: OperatorOperatingModel;
  };
}

export interface PortfolioPreview {
  totalRows: number;
  acceptedRows: number;
  reviewRows: number;
  rejectedRows: number;
  rows: PortfolioPreviewRow[];
}

export interface OperatorPortfolioCandidate {
  id: string;
  dataMode: 'live';
  synthetic: false;
  workspaceId: string;
  operatorPartnerId: string;
  importId: string;
  sourceName: string;
  externalPropertyId: string;
  propertyName: string;
  propertyNameAr: string;
  country: string;
  region: string;
  locationLabel: string;
  locationLabelAr: string;
  ownerReference: string;
  operatingModel: OperatorOperatingModel;
  provenance: 'reported';
  reportedMomentCandidates: ReportedMomentCandidate[];
  unsupportedSourceFields: Record<string, unknown>;
  status: PortfolioCandidateStatus;
  nextAction: string;
  createdAt: string;
  updatedAt: string;
}

export interface OperatorPortfolioImport {
  id: string;
  dataMode: 'live';
  synthetic: false;
  workspaceId: string;
  operatorPartnerId: string;
  sourceName: string;
  sourceType: 'csv' | 'api' | 'manual';
  status: 'completed' | 'needs_review' | 'failed';
  totalRows: number;
  acceptedRows: number;
  reviewRows: number;
  rejectedRows: number;
  createdAt: string;
  updatedAt: string;
}

export interface OperatorFactoryItem {
  id: string;
  lane: 'act_now' | 'revenue' | 'build_next';
  priority: 'critical' | 'high' | 'normal';
  title: string;
  why: string;
  owner: 'operator' | 'owner' | 'scout' | 'bps' | 'dps' | 'community_authority';
  propertyId?: string;
  enquiryId?: string;
  candidateId?: string;
  nextAction: string;
}

export interface OperatorFactorySnapshot {
  metrics: {
    securedBookingValueEgp: number;
    monthlyGrossBookingValueTargetEgp?: number;
    liveHomes: number;
    liveHomesTarget?: number;
    activeEnquiries: number;
    confirmedEnquiries: number;
    arrivalReadinessAtRisk: number;
    portfolioCandidates: number;
  };
  items: OperatorFactoryItem[];
}

const text = (value: unknown): string => (value == null ? '' : String(value)).trim();
const positiveNumber = (value: unknown, field: string): number | undefined => {
  if (value === '' || value === null || value === undefined) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) throw new Error(`invalid_${field}`);
  return parsed;
};

const OPERATING_MODELS = new Set<OperatorOperatingModel>(['fully_managed', 'supported', 'owner_operated']);
const BOOKING_MODELS = new Set<OperatorBookingModel>(['request', 'instant', 'both']);
const CALENDAR_MODELS = new Set<OperatorCalendarModel>(['little_hut', 'external', 'mixed']);
const ASSIGNMENT_MODES = new Set<OperatorAssignmentMode>(['fixed_property_owner', 'region_pool', 'skill_based', 'shift_based', 'round_robin', 'manual']);
const HOUSEKEEPING_MODELS = new Set<OperatorHousekeepingModel>(['in_house', 'vendor', 'mixed']);
const MAINTENANCE_MODELS = new Set<OperatorMaintenanceModel>(['in_house', 'vendor', 'mixed']);
const PRICING_MANDATES = new Set<OperatorWorkspaceInput['pricingMandate']>(['owner_floor_only', 'operator_within_mandate', 'owner_approval_required']);
const CHANNELS = new Set<OperatorWorkspaceInput['notificationChannels'][number]>(['email', 'whatsapp', 'sms']);

export function normalizeOperatorWorkspaceInput(input: Partial<OperatorWorkspaceInput>): OperatorWorkspaceInput {
  const organisationName = text(input.organisationName);
  const country = text(input.country);
  const currency = text(input.currency).toUpperCase();
  const timezone = text(input.timezone);
  if (!organisationName || organisationName.length > 160) throw new Error('invalid_organisation_name');
  if (!country || country.length > 120) throw new Error('invalid_country');
  if (!/^[A-Z]{3}$/.test(currency)) throw new Error('invalid_currency');
  if (!timezone || timezone.length > 80) throw new Error('invalid_timezone');
  if (!input.operatingModel || !OPERATING_MODELS.has(input.operatingModel)) throw new Error('invalid_operating_model');
  if (!input.bookingModel || !BOOKING_MODELS.has(input.bookingModel)) throw new Error('invalid_booking_model');
  if (!input.calendarModel || !CALENDAR_MODELS.has(input.calendarModel)) throw new Error('invalid_calendar_model');
  if (!input.assignmentMode || !ASSIGNMENT_MODES.has(input.assignmentMode)) throw new Error('invalid_assignment_mode');
  if (!input.housekeepingModel || !HOUSEKEEPING_MODELS.has(input.housekeepingModel)) throw new Error('invalid_housekeeping_model');
  if (!input.maintenanceModel || !MAINTENANCE_MODELS.has(input.maintenanceModel)) throw new Error('invalid_maintenance_model');
  if (!input.pricingMandate || !PRICING_MANDATES.has(input.pricingMandate)) throw new Error('invalid_pricing_mandate');
  const notificationChannels = Array.from(new Set(input.notificationChannels || []));
  if (notificationChannels.some((channel) => !CHANNELS.has(channel))) throw new Error('invalid_notification_channel');

  return {
    organisationName,
    country,
    currency,
    timezone,
    operatingModel: input.operatingModel,
    bookingModel: input.bookingModel,
    calendarModel: input.calendarModel,
    assignmentMode: input.assignmentMode,
    housekeepingModel: input.housekeepingModel,
    maintenanceModel: input.maintenanceModel,
    pricingMandate: input.pricingMandate,
    communityApprovalDefault: input.communityApprovalDefault === true,
    notificationChannels,
    targets: {
      monthlyGrossBookingValueEgp: positiveNumber(input.targets?.monthlyGrossBookingValueEgp, 'monthly_gross_booking_value_target'),
      liveHomes: positiveNumber(input.targets?.liveHomes, 'live_homes_target'),
      enquiryResponseMinutes: positiveNumber(input.targets?.enquiryResponseMinutes, 'enquiry_response_minutes'),
    },
  };
}

const canonicalMomentIds = new Set<CanonicalFlagshipMomentId>(CANONICAL_FLAGSHIP_MOMENTS.map((moment) => moment.id));
const portableColumns = new Set([
  'external_property_id', 'property_name', 'property_name_ar', 'country', 'region', 'location_label', 'location_label_ar', 'owner_reference', 'operating_model',
]);

const requiredColumns = ['external_property_id', 'property_name', 'country', 'region', 'location_label', 'owner_reference'] as const;

function reportedMoments(row: PortfolioSourceRow): ReportedMomentCandidate[] {
  const candidates: ReportedMomentCandidate[] = [];
  for (const [key, rawValue] of Object.entries(row)) {
    const normalizedKey = key.toLowerCase().trim().replace(/^moment[_ -]?/, '').replace(/-/g, '_');
    if (!canonicalMomentIds.has(normalizedKey as CanonicalFlagshipMomentId)) continue;
    const value = text(rawValue);
    const lowered = value.toLowerCase();
    if (!value || ['no', 'false', '0', 'unknown', 'ruled_out', 'ruled out'].includes(lowered)) continue;
    candidates.push({
      momentId: normalizedKey as CanonicalFlagshipMomentId,
      reportedValue: value,
      provenance: 'reported',
      resolvedState: 'unknown',
    });
  }
  return candidates;
}

function unsupportedFields(row: PortfolioSourceRow): Record<string, unknown> {
  return Object.fromEntries(Object.entries(row).filter(([key]) => {
    const normalizedKey = key.toLowerCase().trim().replace(/^moment[_ -]?/, '').replace(/-/g, '_');
    return !portableColumns.has(key) && !canonicalMomentIds.has(normalizedKey as CanonicalFlagshipMomentId);
  }));
}

export function previewPortfolioRows(rows: PortfolioSourceRow[], existingExternalIds: string[] = []): PortfolioPreview {
  if (!Array.isArray(rows)) throw new Error('portfolio_rows_must_be_array');
  if (rows.length === 0) throw new Error('portfolio_rows_required');
  if (rows.length > 250) throw new Error('portfolio_import_too_large');

  const existing = new Set(existingExternalIds.map(text).filter(Boolean));
  const seen = new Set<string>();
  const previewRows: PortfolioPreviewRow[] = rows.map((row, index) => {
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      return {
        rowNumber: index + 2,
        status: 'rejected',
        externalPropertyId: null,
        propertyName: null,
        issues: ['Row is not a property record.'],
        warnings: [],
        provenance: 'reported',
        reportedMomentCandidates: [],
        unsupportedSourceFields: {},
        nextAction: 'Correct the row and upload it again.',
      };
    }

    const missing = requiredColumns.filter((field) => !text(row[field]));
    const externalPropertyId = text(row.external_property_id);
    const duplicateInFile = externalPropertyId ? seen.has(externalPropertyId) : false;
    const matchesExisting = externalPropertyId ? existing.has(externalPropertyId) : false;
    if (externalPropertyId) seen.add(externalPropertyId);

    const issues: string[] = [];
    const warnings: string[] = [];
    if (missing.length) issues.push(`Missing required fields: ${missing.join(', ')}`);
    if (duplicateInFile) issues.push('Duplicate external_property_id in this upload.');
    if (matchesExisting) warnings.push('This external_property_id already exists and requires an explicit review; it will not be overwritten.');

    const operatingModelRaw = text(row.operating_model) as OperatorOperatingModel;
    if (operatingModelRaw && !OPERATING_MODELS.has(operatingModelRaw)) issues.push('operating_model must be fully_managed, supported, or owner_operated.');

    const momentCandidates = reportedMoments(row);
    if (momentCandidates.length) warnings.push('Moment claims are imported only as reported candidates. They remain unknown until the evidence process resolves them.');
    const extras = unsupportedFields(row);
    if (Object.keys(extras).length) warnings.push('Unsupported source columns are preserved in the import receipt instead of being discarded.');

    let status: PortfolioRowStatus = 'accepted';
    let nextAction = 'Create an operator portfolio candidate and route it to the sourcing/evidence journey.';
    if (issues.length) {
      status = 'rejected';
      nextAction = 'Correct the blocking source data before this home can enter the pipeline.';
    } else if (matchesExisting) {
      status = 'needs_review';
      nextAction = 'Review the existing candidate and choose merge, replace source evidence, or skip. No automatic overwrite is allowed.';
    }

    const propertyName = text(row.property_name);
    const locationLabel = text(row.location_label);
    const normalized = issues.length ? undefined : {
      externalPropertyId,
      propertyName,
      propertyNameAr: text(row.property_name_ar) || propertyName,
      country: text(row.country),
      region: text(row.region),
      locationLabel,
      locationLabelAr: text(row.location_label_ar) || locationLabel,
      ownerReference: text(row.owner_reference),
      operatingModel: operatingModelRaw || undefined,
    };

    return {
      rowNumber: index + 2,
      status,
      externalPropertyId: externalPropertyId || null,
      propertyName: propertyName || null,
      issues,
      warnings,
      provenance: 'reported',
      reportedMomentCandidates: momentCandidates,
      unsupportedSourceFields: extras,
      nextAction,
      normalized,
    };
  });

  return {
    totalRows: previewRows.length,
    acceptedRows: previewRows.filter((row) => row.status === 'accepted').length,
    reviewRows: previewRows.filter((row) => row.status === 'needs_review').length,
    rejectedRows: previewRows.filter((row) => row.status === 'rejected').length,
    rows: previewRows,
  };
}

function parseCsvCells(line: string): string[] {
  const cells: string[] = [];
  let value = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') { value += '"'; i += 1; }
      else quoted = !quoted;
    } else if (char === ',' && !quoted) {
      cells.push(value.trim());
      value = '';
    } else {
      value += char;
    }
  }
  cells.push(value.trim());
  return cells;
}

export function parsePortfolioCsv(csv: string): PortfolioSourceRow[] {
  const normalized = csv.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  if (!normalized) throw new Error('portfolio_file_empty');
  const lines = normalized.split('\n').filter((line) => line.trim());
  if (lines.length < 2) throw new Error('portfolio_file_requires_header_and_rows');
  const headers = parseCsvCells(lines[0]).map((header) => header.trim().toLowerCase());
  if (new Set(headers).size !== headers.length) throw new Error('portfolio_file_duplicate_headers');
  return lines.slice(1).map((line) => {
    const cells = parseCsvCells(line);
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? '']));
  });
}

const terminalStages = new Set(['completed', 'declined', 'expired', 'cancelled']);
const securedStages = new Set(['confirmed', 'completed']);

function propertyName(property: Property | undefined): string {
  return property?.name || 'Home';
}

function enquiryFactoryItem(enquiry: Enquiry, property: Property | undefined): OperatorFactoryItem | null {
  const stage = enquiry.stage;
  const home = propertyName(property);
  if (stage === 'payment_pending') return { id: `pay-${enquiry.id}`, lane: 'act_now', priority: 'high', title: `Payment gate · ${home}`, why: 'Demand is qualified but the stay cannot progress without authoritative payment evidence.', owner: 'operator', propertyId: enquiry.propertyId, enquiryId: enquiry.id, nextAction: 'Resolve the payment evidence through the configured payment path; do not confirm until every gate passes.' };
  if (stage === 'community_approval_pending') return { id: `community-${enquiry.id}`, lane: 'act_now', priority: 'high', title: `External approval · ${home}`, why: 'A confirmed commercial journey is waiting on an external authority.', owner: 'community_authority', propertyId: enquiry.propertyId, enquiryId: enquiry.id, nextAction: 'Obtain and record the external approval evidence from the named authority.' };
  if (stage === 'confirmed' && enquiry.readinessCheck?.status !== 'ready') return { id: `readiness-${enquiry.id}`, lane: 'act_now', priority: 'critical', title: `Arrival readiness · ${home}`, why: 'The stay is confirmed but readiness is not yet proven.', owner: 'operator', propertyId: enquiry.propertyId, enquiryId: enquiry.id, nextAction: 'Complete the readiness checklist and required evidence before arrival.' };
  if (stage === 'received') return { id: `qualify-${enquiry.id}`, lane: 'revenue', priority: 'high', title: `New demand · ${home}`, why: 'A guest request is waiting for qualification.', owner: 'operator', propertyId: enquiry.propertyId, enquiryId: enquiry.id, nextAction: 'Qualify party size, dates, requested Moment and current calendar authority.' };
  if (stage === 'qualified' || stage === 'availability_checked') return { id: `quote-${enquiry.id}`, lane: 'revenue', priority: 'high', title: `Convert demand · ${home}`, why: 'Qualified demand has not yet reached an approved quote.', owner: 'operator', propertyId: enquiry.propertyId, enquiryId: enquiry.id, nextAction: 'Verify availability and issue the next quote permitted by the owner mandate.' };
  return null;
}

export function deriveOperatorFactory(dataset: OperatingDataset, workspace: OperatorWorkspace | null, candidates: OperatorPortfolioCandidate[], now = new Date()): OperatorFactorySnapshot {
  const properties = workspace
    ? dataset.properties.filter((property) => property.operatorPartnerId === workspace.operatorPartnerId)
    : dataset.properties;
  const propertyIds = new Set(properties.map((property) => property.id));
  const enquiries = dataset.enquiries.filter((enquiry) => propertyIds.has(enquiry.propertyId));
  const monthPrefix = now.toISOString().slice(0, 7);
  const securedBookingValueEgp = enquiries
    .filter((enquiry) => securedStages.has(String(enquiry.stage)) && enquiry.updatedAt?.startsWith(monthPrefix))
    .reduce((sum, enquiry) => sum + (enquiry.quote?.totalEgp || 0), 0);
  const liveHomes = properties.filter((property) => property.supplyStage === 'live' && property.publiclyVisible && property.sealIssued).length;
  const activeEnquiries = enquiries.filter((enquiry) => !terminalStages.has(String(enquiry.stage))).length;
  const confirmedEnquiries = enquiries.filter((enquiry) => enquiry.stage === 'confirmed').length;
  const arrivalReadinessAtRisk = enquiries.filter((enquiry) => enquiry.stage === 'confirmed' && enquiry.readinessCheck?.status !== 'ready').length;

  const items: OperatorFactoryItem[] = [];
  for (const enquiry of enquiries) {
    const item = enquiryFactoryItem(enquiry, properties.find((property) => property.id === enquiry.propertyId));
    if (item) items.push(item);
  }
  for (const candidate of candidates.filter((item) => item.status === 'ready_for_sourcing')) {
    items.push({ id: `candidate-${candidate.id}`, lane: 'build_next', priority: 'normal', title: `Progress ${candidate.propertyName}`, why: 'The operator supplied portfolio truth, but it has not yet entered the independent Home Moments qualification journey.', owner: 'scout', candidateId: candidate.id, nextAction: 'Route the candidate to a Scout for source/consent verification, then continue through assessment, Owner mandate and activation.' });
  }
  for (const property of properties) {
    if (property.supplyStage === 'sourced' || property.supplyStage === 'owner_engaged') {
      items.push({ id: `supply-${property.id}`, lane: 'build_next', priority: 'normal', title: `Qualify ${property.name}`, why: 'This home is inside the supply journey but is not yet independently qualified.', owner: property.supplyStage === 'sourced' ? 'scout' : 'bps', propertyId: property.id, nextAction: property.supplyStage === 'sourced' ? 'Complete source and owner-consent evidence.' : 'Progress the independent assessment without upgrading unsupported claims.' });
    }
  }
  if (workspace?.targets?.monthlyGrossBookingValueEgp && securedBookingValueEgp < workspace.targets.monthlyGrossBookingValueEgp) {
    items.push({ id: 'target-gbv-gap', lane: 'revenue', priority: 'normal', title: 'Booking-value target gap', why: `Secured value is EGP ${securedBookingValueEgp.toLocaleString()} against the configured EGP ${workspace.targets.monthlyGrossBookingValueEgp.toLocaleString()} monthly target.`, owner: 'operator', nextAction: 'Work the highest-confidence qualified demand and sellable inventory already supported by current evidence and authority.' });
  }

  const rank = { critical: 0, high: 1, normal: 2 } as const;
  items.sort((a, b) => rank[a.priority] - rank[b.priority]);
  return {
    metrics: {
      securedBookingValueEgp,
      monthlyGrossBookingValueTargetEgp: workspace?.targets?.monthlyGrossBookingValueEgp,
      liveHomes,
      liveHomesTarget: workspace?.targets?.liveHomes,
      activeEnquiries,
      confirmedEnquiries,
      arrivalReadinessAtRisk,
      portfolioCandidates: candidates.filter((candidate) => !['converted', 'dismissed'].includes(candidate.status)).length,
    },
    items,
  };
}
