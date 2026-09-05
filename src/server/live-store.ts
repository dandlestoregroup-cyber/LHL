import crypto from 'node:crypto';
import type { Assessment, Enquiry, EnquiryStage, MomentKey, OperatingDataset, OwnerDecision, Partner, Property } from '../types';
import { canConfirmStay, evaluateRateFloor, evaluateStayDates, isHoldActive } from '../lib/lh-core.js';
import { createDocument, getDocument, listDocuments, replaceDocument } from './firestore-rest';
import type { LiveSession } from './session-auth';
import { isBootstrapIdentity } from './session-auth';

export class LiveStoreError extends Error {
  constructor(public readonly code: string, public readonly status = 400) {
    super(code);
    this.name = 'LiveStoreError';
  }
}

const cleanString = (value: unknown, field: string, max = 180): string => {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) throw new LiveStoreError(`invalid_${field}`);
  return value.trim();
};

const publicProperty = (property: Property): Property => ({
  ...property,
  scoutPartnerId: '',
  ownerPartnerId: undefined,
  operatorPartnerId: undefined,
  assessorPartnerId: undefined,
  communityAuthorityPartnerId: property.communityApprovalRequired ? property.communityAuthorityPartnerId : undefined,
  nightlyFloorEgp: undefined,
  payoutReady: false,
  activationChecklistComplete: false,
  inventoryBaseline: undefined,
});

async function partnerFor(session: LiveSession): Promise<Partner> {
  const stored = await getDocument<Partner>('partners', session.uid);
  if (!stored || stored.data.dataMode !== 'live' || stored.data.synthetic || stored.data.status !== 'active') {
    throw new LiveStoreError('live_partner_required', 403);
  }
  return stored.data;
}

export async function sessionPartner(session: LiveSession): Promise<Partner | null> {
  const stored = await getDocument<Partner>('partners', session.uid);
  if (!stored || stored.data.dataMode !== 'live' || stored.data.synthetic) return null;
  return stored.data;
}

export async function loadLiveDataset(session?: LiveSession | null): Promise<OperatingDataset> {
  const [partnersStored, propertiesStored, assessmentsStored, decisionsStored, enquiriesStored] = await Promise.all([
    listDocuments<Partner>('partners'),
    listDocuments<Property>('properties'),
    listDocuments<Assessment>('assessments'),
    listDocuments<OwnerDecision>('ownerDecisions'),
    listDocuments<Enquiry>('enquiries'),
  ]);
  const partners = partnersStored.map((item) => item.data).filter((item) => item.dataMode === 'live' && !item.synthetic);
  const properties = propertiesStored.map((item) => item.data).filter((item) => item.dataMode === 'live' && !item.synthetic);
  const assessments = assessmentsStored.map((item) => item.data).filter((item) => item.dataMode === 'live' && !item.synthetic);
  const ownerDecisions = decisionsStored.map((item) => item.data).filter((item) => item.dataMode === 'live' && !item.synthetic);
  const enquiries = enquiriesStored.map((item) => item.data).filter((item) => item.dataMode === 'live' && !item.synthetic);
  const now = new Date().toISOString();

  if (!session) {
    return {
      mode: 'live',
      label: 'Live operations — verified public records only',
      labelAr: 'التشغيل الفعلي — السجلات العامة الموثقة فقط',
      asOf: now,
      partners: [],
      properties: properties
        .filter((property) => (property.supplyStage === 'live' && property.publiclyVisible && property.sealIssued) || property.joiningVisible)
        .map(publicProperty),
      assessments: [],
      ownerDecisions: [],
      enquiries: [],
    };
  }

  const current = partners.find((partner) => partner.id === session.uid && partner.status === 'active');
  if (!current) {
    return {
      mode: 'live', label: 'Live operations — identity not onboarded', labelAr: 'التشغيل الفعلي — الهوية غير مفعلة', asOf: now,
      partners: [], properties: [], assessments: [], ownerDecisions: [], enquiries: [],
    };
  }
  if (current.platformAdmin) {
    return { mode: 'live', label: 'Live operations — verified records only', labelAr: 'التشغيل الفعلي — سجلات موثقة فقط', asOf: now, partners, properties, assessments, ownerDecisions, enquiries };
  }

  const scopedProperties = properties.filter((property) => {
    if (current.role === 'scout') return property.scoutPartnerId === current.id;
    if (current.role === 'owner') return property.ownerPartnerId === current.id;
    if (current.role === 'operator') return property.operatorPartnerId === current.id;
    if (current.role === 'assessor') return property.assessorPartnerId === current.id;
    if (current.role === 'community_authority') return property.communityAuthorityPartnerId === current.id;
    return false;
  });
  const propertyIds = new Set(scopedProperties.map((property) => property.id));
  const canSeeBookings = current.role === 'owner' || current.role === 'operator';
  return {
    mode: 'live',
    label: 'Live operations — role-scoped verified records',
    labelAr: 'التشغيل الفعلي — سجلات موثقة حسب الصلاحية',
    asOf: now,
    partners: [current],
    properties: scopedProperties,
    assessments: assessments.filter((assessment) => propertyIds.has(assessment.propertyId)),
    ownerDecisions: ownerDecisions.filter((decision) => propertyIds.has(decision.propertyId)),
    enquiries: canSeeBookings ? enquiries.filter((enquiry) => propertyIds.has(enquiry.propertyId)) : [],
  };
}

export async function bootstrapFirstScout(session: LiveSession, input: Record<string, unknown>): Promise<Partner> {
  if (!isBootstrapIdentity(session)) throw new LiveStoreError('bootstrap_identity_not_allowed', 403);
  const existing = await listDocuments<Partner>('partners');
  const current = existing.find((item) => item.data.id === session.uid)?.data;
  if (current) return current;
  if (existing.some((item) => item.data.dataMode === 'live' && !item.data.synthetic)) throw new LiveStoreError('bootstrap_already_closed', 409);
  const now = new Date().toISOString();
  const partner: Partner = {
    id: session.uid,
    dataMode: 'live',
    synthetic: false,
    createdAt: now,
    updatedAt: now,
    role: 'scout',
    status: 'active',
    platformAdmin: true,
    name: cleanString(input.name, 'name', 120),
    nameAr: typeof input.nameAr === 'string' && input.nameAr.trim() ? input.nameAr.trim().slice(0, 120) : cleanString(input.name, 'name', 120),
    organisation: typeof input.organisation === 'string' && input.organisation.trim() ? input.organisation.trim().slice(0, 160) : 'Little Hut',
    serviceArea: cleanString(input.serviceArea, 'service_area', 120),
    serviceAreaAr: typeof input.serviceAreaAr === 'string' && input.serviceAreaAr.trim() ? input.serviceAreaAr.trim().slice(0, 120) : cleanString(input.serviceArea, 'service_area', 120),
  };
  await createDocument('partners', partner.id, partner as unknown as Record<string, unknown>);
  return partner;
}

export async function createScoutProperty(session: LiveSession, input: Record<string, unknown>): Promise<Property> {
  const partner = await partnerFor(session);
  if (partner.role !== 'scout') throw new LiveStoreError('scout_authority_required', 403);
  const now = new Date().toISOString();
  const id = `live-property-${crypto.randomUUID()}`;
  const name = cleanString(input.name, 'name', 120);
  const location = cleanString(input.location, 'location', 120);
  const property: Property = {
    id,
    dataMode: 'live',
    synthetic: false,
    createdAt: now,
    updatedAt: now,
    slug: `joining-${id.slice(-12)}`,
    name,
    nameAr: typeof input.nameAr === 'string' && input.nameAr.trim() ? input.nameAr.trim().slice(0, 120) : name,
    location,
    locationAr: typeof input.locationAr === 'string' && input.locationAr.trim() ? input.locationAr.trim().slice(0, 120) : location,
    summary: 'Scout-sourced lead. Listing evidence only; no public claims.',
    summaryAr: 'ترشيح من الكشاف بأدلة إعلان فقط ودون ادعاءات عامة.',
    supplyStage: 'sourced',
    scoutPartnerId: partner.id,
    publiclyVisible: false,
    joiningVisible: true,
    sealIssued: false,
    maxGuests: 0,
    bedroomCount: 0,
    calendarAuthority: 'unknown',
    bookingMode: 'request',
    communityApprovalRequired: false,
    activationChecklistComplete: false,
    payoutReady: false,
    heroImage: '',
    galleryImages: [],
    provenMoments: [],
  };
  await createDocument('properties', property.id, property as unknown as Record<string, unknown>);
  return property;
}

export async function createLiveEnquiry(input: Record<string, unknown>): Promise<Enquiry> {
  const propertyId = cleanString(input.propertyId, 'property_id', 120);
  const storedProperty = await getDocument<Property>('properties', propertyId);
  const property = storedProperty?.data;
  if (!property || property.dataMode !== 'live' || property.synthetic || property.supplyStage !== 'live' || !property.publiclyVisible || !property.sealIssued) {
    throw new LiveStoreError('public_live_property_required', 403);
  }
  const checkIn = cleanString(input.checkIn, 'check_in', 10);
  const checkOut = cleanString(input.checkOut, 'check_out', 10);
  const dateCheck = evaluateStayDates(checkIn, checkOut);
  if (!dateCheck.allowed) throw new LiveStoreError('invalid_stay_dates');
  const adults = Number(input.adults);
  const children = Number(input.children);
  if (!Number.isInteger(adults) || adults < 1 || !Number.isInteger(children) || children < 0 || adults + children > property.maxGuests) {
    throw new LiveStoreError('invalid_guest_count');
  }
  const requestedMoment = cleanString(input.requestedMoment, 'requested_moment', 64) as MomentKey;
  if (!property.provenMoments.some((moment) => moment.key === requestedMoment)) throw new LiveStoreError('unproven_moment');
  const now = new Date().toISOString();
  const enquiry: Enquiry = {
    id: `live-enquiry-${crypto.randomUUID()}`,
    dataMode: 'live',
    synthetic: false,
    createdAt: now,
    updatedAt: now,
    propertyId,
    guestName: cleanString(input.guestName, 'guest_name', 120),
    guestPhoneMasked: cleanString(input.guestPhoneMasked, 'guest_phone', 64),
    checkIn,
    checkOut,
    adults,
    children,
    requestedMoment,
    stage: 'received',
    source: 'direct',
    communityApproval: {
      required: property.communityApprovalRequired,
      status: property.communityApprovalRequired ? 'not_submitted' : 'not_required',
      authorityPartnerId: property.communityAuthorityPartnerId,
    },
    timeline: [{ stage: 'received', at: now, note: 'Guest submitted stay enquiry.' }],
  };
  await createDocument('enquiries', enquiry.id, enquiry as unknown as Record<string, unknown>);
  return enquiry;
}

export interface AdvanceInput {
  nightlyRateEgp?: unknown;
  paymentReference?: unknown;
  paymentAmountEgp?: unknown;
}

export async function advanceLiveEnquiry(session: LiveSession, id: string, input: AdvanceInput = {}): Promise<Enquiry> {
  const partner = await partnerFor(session);
  if (partner.role !== 'operator') throw new LiveStoreError('operator_authority_required', 403);
  const stored = await getDocument<Enquiry>('enquiries', id);
  if (!stored) throw new LiveStoreError('enquiry_not_found', 404);
  const target = stored.data;
  const propertyStored = await getDocument<Property>('properties', target.propertyId);
  const property = propertyStored?.data;
  if (!property || property.operatorPartnerId !== partner.id) throw new LiveStoreError('operator_not_assigned', 403);
  const dateCheck = evaluateStayDates(target.checkIn, target.checkOut);
  if (!dateCheck.allowed) throw new LiveStoreError('invalid_stay_dates', 409);
  const now = new Date();
  const at = now.toISOString();
  let updated: Enquiry = { ...target, updatedAt: at };
  let next: EnquiryStage | null = null;
  let note = '';

  if (target.stage === 'received') { next = 'qualified'; note = 'Operator qualified party size and stay purpose.'; }
  else if (target.stage === 'qualified') { next = 'availability_checked'; note = 'Operator verified calendar authority and availability.'; }
  else if (target.stage === 'availability_checked') {
    const nightlyRateEgp = Number(input.nightlyRateEgp);
    if (!evaluateRateFloor(property, nightlyRateEgp).allowed) throw new LiveStoreError('quote_below_owner_floor');
    next = 'quoted'; note = 'Operator issued an in-floor accommodation quote.';
    updated.quote = { nightlyRateEgp, nights: dateCheck.nights, accommodationEgp: nightlyRateEgp * dateCheck.nights, feesEgp: 0, totalEgp: nightlyRateEgp * dateCheck.nights, issuedAt: at };
  } else if (target.stage === 'quoted') {
    if (!evaluateRateFloor(property, target.quote?.nightlyRateEgp ?? 0).allowed) throw new LiveStoreError('invalid_quote', 409);
    next = 'hold'; note = 'Operator placed a two-hour expiring hold.';
    updated.hold = { active: true, expiresAt: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString() };
  } else if (target.stage === 'hold') {
    if (!isHoldActive(target.hold, now)) { next = 'expired'; note = 'Hold expired and released the calendar.'; }
    else { next = 'payment_pending'; note = 'Payment request issued against active hold.'; }
  } else if (target.stage === 'payment_pending') {
    if (!isHoldActive(target.hold, now) || !property.payoutReady || !target.quote || !evaluateRateFloor(property, target.quote.nightlyRateEgp).allowed) {
      throw new LiveStoreError('payment_gates_not_satisfied', 409);
    }
    const reference = cleanString(input.paymentReference, 'payment_reference', 120);
    const amount = Number(input.paymentAmountEgp);
    if (!Number.isFinite(amount) || amount !== target.quote.totalEgp) throw new LiveStoreError('payment_amount_mismatch');
    next = 'payment_received'; note = 'Operator recorded external payment evidence.';
    updated.payment = { amountEgp: amount, receivedAt: at, reference };
  } else if (target.stage === 'payment_received') {
    if (!isHoldActive(target.hold, now)) throw new LiveStoreError('hold_expired', 409);
    next = property.communityApprovalRequired ? 'community_approval_pending' : 'confirmed';
    note = property.communityApprovalRequired ? 'Guest manifest submitted to the named community authority.' : 'Stay confirmed; no community gate applies.';
    updated.communityApproval = property.communityApprovalRequired
      ? { required: true, status: 'pending', authorityPartnerId: property.communityAuthorityPartnerId }
      : { required: false, status: 'not_required' };
  } else if (target.stage === 'community_approved') {
    if (!canConfirmStay(property, target, now).allowed) throw new LiveStoreError('confirmation_gates_not_satisfied', 409);
    next = 'confirmed'; note = 'Operator confirmed after recording the external approval.';
  } else if (target.stage === 'confirmed') {
    if (!property.inventoryBaseline?.items.length || target.readinessCheck?.status !== 'ready' || !target.proofStay?.preStay) {
      throw new LiveStoreError('stay_assurance_required_before_completion', 409);
    }
    if (target.readinessCheck.baselineCapturedAt !== property.inventoryBaseline.capturedAt || target.proofStay.preStay.baselineCapturedAt !== property.inventoryBaseline.capturedAt) {
      throw new LiveStoreError('stay_assurance_baseline_is_stale', 409);
    }
    next = 'completed'; note = 'Stay outcome recorded as completed after readiness and pre-stay assurance evidence.';
  }
  if (!next) throw new LiveStoreError('no_available_transition', 409);
  updated.stage = next;
  updated.timeline = [...updated.timeline, { stage: next, at, note, byPartnerId: partner.id }];
  await replaceDocument('enquiries', id, updated as unknown as Record<string, unknown>, stored.updateTime);
  return updated;
}

export async function recordLiveCommunityApproval(session: LiveSession, id: string, evidenceReference: unknown): Promise<Enquiry> {
  const partner = await partnerFor(session);
  if (partner.role !== 'operator') throw new LiveStoreError('operator_authority_required', 403);
  const stored = await getDocument<Enquiry>('enquiries', id);
  if (!stored) throw new LiveStoreError('enquiry_not_found', 404);
  const target = stored.data;
  const propertyStored = await getDocument<Property>('properties', target.propertyId);
  const property = propertyStored?.data;
  if (!property || property.operatorPartnerId !== partner.id) throw new LiveStoreError('operator_not_assigned', 403);
  if (target.stage !== 'community_approval_pending' || !property.communityApprovalRequired || !property.communityAuthorityPartnerId || target.communityApproval?.authorityPartnerId !== property.communityAuthorityPartnerId) {
    throw new LiveStoreError('community_approval_not_recordable', 409);
  }
  const evidence = cleanString(evidenceReference, 'evidence_reference', 120);
  const at = new Date().toISOString();
  const updated: Enquiry = {
    ...target,
    updatedAt: at,
    stage: 'community_approved',
    communityApproval: { required: true, status: 'approved', authorityPartnerId: property.communityAuthorityPartnerId, evidenceReference: evidence },
    timeline: [...target.timeline, { stage: 'community_approved', at, byPartnerId: partner.id, note: 'Operator recorded approval already issued by the named community authority.' }],
  };
  await replaceDocument('enquiries', id, updated as unknown as Record<string, unknown>, stored.updateTime);
  return updated;
}
