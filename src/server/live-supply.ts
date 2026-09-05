import type {
  Assessment,
  AssessmentGate,
  GateStatus,
  MomentKey,
  OwnerDecision,
  Partner,
  PartnerRole,
  Property,
  PropertyMoment,
} from '../types';
import {
  MOMENT_KEYS,
  SHIELD_GATE_KEYS,
  TRUST_GATE_KEYS,
  evaluateAssessment,
  evaluateGoLive,
  resolveBookingMode,
} from '../lib/lh-core.js';
import { commitDocuments, getDocument } from './firestore-rest';
import type { LiveSession } from './session-auth';
import { LiveStoreError, sessionPartner } from './live-store';

const trustLabels: Record<string, [string, string]> = {
  truth: ['Truth', 'الصدق'],
  readiness: ['Readiness', 'الجاهزية'],
  privacy: ['Privacy', 'الخصوصية'],
  comfort: ['Comfort', 'الراحة'],
  arrival: ['Arrival', 'الوصول'],
  moment: ['Moment integrity', 'سلامة اللحظة'],
};

const shieldLabels: Record<string, [string, string]> = {
  fire: ['Fire', 'الحريق'],
  water: ['Water', 'المياه'],
  access: ['Access', 'الدخول'],
  electrical: ['Electrical', 'الكهرباء'],
  child: ['Child safety', 'سلامة الأطفال'],
  emergency: ['Emergency', 'الطوارئ'],
};

const momentLabels: Record<MomentKey, [string, string]> = {
  slow_morning: ['Slow Morning', 'الصباح الهادئ'],
  long_table: ['Long Table', 'المائدة الممتدة'],
  afternoon_drift: ['Afternoon Drift', 'سكون الظهيرة'],
  night_swim: ['Night Swim', 'السباحة الليلية'],
  fire_conversation: ['Fire Conversation', 'حوار حول النار'],
  silent_reading: ['Silent Reading', 'القراءة الصامتة'],
};

const cleanString = (value: unknown, field: string, max = 180): string => {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) {
    throw new LiveStoreError(`invalid_${field}`);
  }
  return value.trim();
};

const optionalString = (value: unknown, max = 500): string =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

const requireInteger = (value: unknown, field: string, min: number, max: number): number => {
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) throw new LiveStoreError(`invalid_${field}`);
  return number;
};

const requireIsoDay = (value: unknown, field: string): string => {
  const day = cleanString(value, field, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new LiveStoreError(`invalid_${field}`);
  const parsed = new Date(`${day}T00:00:00.000Z`);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== day) throw new LiveStoreError(`invalid_${field}`);
  return day;
};

const requireHttpsUrl = (value: unknown, field: string): string => {
  const raw = cleanString(value, field, 1200);
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:') throw new Error('not https');
    return url.toString();
  } catch {
    throw new LiveStoreError(`invalid_${field}`);
  }
};

const requirePartner = async (id: unknown, role: PartnerRole): Promise<Partner> => {
  const partnerId = cleanString(id, `${role}_partner_id`, 160);
  const stored = await getDocument<Partner>('partners', partnerId);
  if (!stored || stored.data.dataMode !== 'live' || stored.data.synthetic || stored.data.status !== 'active' || stored.data.role !== role) {
    throw new LiveStoreError(`active_${role}_required`, 409);
  }
  return stored.data;
};

const requireCurrentPartner = async (session: LiveSession, role?: PartnerRole): Promise<Partner> => {
  const partner = await sessionPartner(session);
  if (!partner || partner.status !== 'active') throw new LiveStoreError('live_partner_required', 403);
  if (role && partner.role !== role) throw new LiveStoreError(`${role}_authority_required`, 403);
  return partner;
};

const requirePlatformAdmin = async (session: LiveSession): Promise<Partner> => {
  const partner = await requireCurrentPartner(session);
  if (!partner.platformAdmin) throw new LiveStoreError('platform_admin_required', 403);
  return partner;
};

const getProperty = async (id: string) => {
  const stored = await getDocument<Property>('properties', id);
  if (!stored || stored.data.dataMode !== 'live' || stored.data.synthetic) throw new LiveStoreError('property_not_found', 404);
  return stored;
};

const assessmentId = (propertyId: string) => `assessment-${propertyId}`;
const decisionId = (propertyId: string) => `decision-${propertyId}`;

const pendingGate = (key: string, labels: Record<string, [string, string]>): AssessmentGate => ({
  key,
  label: labels[key][0],
  labelAr: labels[key][1],
  status: 'pending',
});

export async function assignOwnerToProperty(session: LiveSession, propertyId: string, input: Record<string, unknown>): Promise<Property> {
  await requirePlatformAdmin(session);
  const propertyStored = await getProperty(propertyId);
  if (propertyStored.data.supplyStage !== 'sourced') throw new LiveStoreError('owner_assignment_requires_sourced_stage', 409);
  const owner = await requirePartner(input.ownerPartnerId, 'owner');
  const consentReference = cleanString(input.ownerConsentReference, 'owner_consent_reference', 180);
  const now = new Date().toISOString();
  const updated: Property = {
    ...propertyStored.data,
    ownerPartnerId: owner.id,
    ownerConsentReference: consentReference,
    supplyStage: 'owner_engaged',
    updatedAt: now,
  };
  await commitDocuments([{ mode: 'replace', collection: 'properties', id: propertyId, data: updated as unknown as Record<string, unknown>, expectedUpdateTime: propertyStored.updateTime }]);
  return updated;
}

export async function assignOperatorToProperty(session: LiveSession, propertyId: string, input: Record<string, unknown>): Promise<Property> {
  await requirePlatformAdmin(session);
  const propertyStored = await getProperty(propertyId);
  if (['sourced', 'declined', 'live'].includes(propertyStored.data.supplyStage)) throw new LiveStoreError('operator_assignment_not_available', 409);
  const operator = await requirePartner(input.operatorPartnerId, 'operator');
  const updated: Property = { ...propertyStored.data, operatorPartnerId: operator.id, updatedAt: new Date().toISOString() };
  await commitDocuments([{ mode: 'replace', collection: 'properties', id: propertyId, data: updated as unknown as Record<string, unknown>, expectedUpdateTime: propertyStored.updateTime }]);
  return updated;
}

export async function assignCommunityAuthorityToProperty(session: LiveSession, propertyId: string, input: Record<string, unknown>): Promise<Property> {
  await requirePlatformAdmin(session);
  const propertyStored = await getProperty(propertyId);
  if (['sourced', 'declined', 'live'].includes(propertyStored.data.supplyStage)) throw new LiveStoreError('community_authority_assignment_not_available', 409);
  const authority = await requirePartner(input.communityAuthorityPartnerId, 'community_authority');
  const updated: Property = { ...propertyStored.data, communityAuthorityPartnerId: authority.id, updatedAt: new Date().toISOString() };
  await commitDocuments([{ mode: 'replace', collection: 'properties', id: propertyId, data: updated as unknown as Record<string, unknown>, expectedUpdateTime: propertyStored.updateTime }]);
  return updated;
}

export async function schedulePropertyAssessment(session: LiveSession, propertyId: string, input: Record<string, unknown>): Promise<Assessment> {
  await requirePlatformAdmin(session);
  const propertyStored = await getProperty(propertyId);
  if (!['owner_engaged', 'paused'].includes(propertyStored.data.supplyStage)) throw new LiveStoreError('assessment_schedule_not_available', 409);
  if (!propertyStored.data.ownerPartnerId || !propertyStored.data.ownerConsentReference) throw new LiveStoreError('verified_owner_engagement_required', 409);
  const assessor = await requirePartner(input.assessorPartnerId, 'assessor');
  if ([propertyStored.data.ownerPartnerId, propertyStored.data.scoutPartnerId].includes(assessor.id)) throw new LiveStoreError('assessor_must_be_independent', 409);
  const scheduledFor = requireIsoDay(input.scheduledFor, 'scheduled_for');
  const today = new Date().toISOString().slice(0, 10);
  if (scheduledFor < today) throw new LiveStoreError('assessment_date_in_past');
  const now = new Date().toISOString();
  const id = assessmentId(propertyId);
  const existing = await getDocument<Assessment>('assessments', id);
  const assessment: Assessment = {
    id,
    dataMode: 'live',
    synthetic: false,
    createdAt: existing?.data.createdAt || now,
    updatedAt: now,
    propertyId,
    assessorPartnerId: assessor.id,
    independenceConfirmed: false,
    scheduledFor,
    completedAt: undefined,
    result: 'scheduled',
    trustGates: TRUST_GATE_KEYS.map((key: string) => pendingGate(key, trustLabels)),
    shieldGates: SHIELD_GATE_KEYS.map((key: string) => pendingGate(key, shieldLabels)),
    provenMomentKeys: [],
    evidenceCount: 0,
    evidenceReferences: [],
    recommendation: '',
    recommendationAr: '',
  };
  const property: Property = {
    ...propertyStored.data,
    assessorPartnerId: assessor.id,
    supplyStage: 'assessment_scheduled',
    provenMoments: [],
    updatedAt: now,
  };
  await commitDocuments([
    existing
      ? { mode: 'replace', collection: 'assessments', id, data: assessment as unknown as Record<string, unknown>, expectedUpdateTime: existing.updateTime }
      : { mode: 'create', collection: 'assessments', id, data: assessment as unknown as Record<string, unknown> },
    { mode: 'replace', collection: 'properties', id: propertyId, data: property as unknown as Record<string, unknown>, expectedUpdateTime: propertyStored.updateTime },
  ]);
  return assessment;
}

const normalizeFinalGates = (value: unknown, keys: readonly string[], labels: Record<string, [string, string]>, field: string): AssessmentGate[] => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new LiveStoreError(`invalid_${field}`);
  const input = value as Record<string, unknown>;
  const providedKeys = Object.keys(input);
  if (providedKeys.length !== keys.length || providedKeys.some((key) => !keys.includes(key))) throw new LiveStoreError(`invalid_${field}`);
  return keys.map((key) => {
    const raw = input[key];
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new LiveStoreError(`invalid_${field}_${key}`);
    const record = raw as Record<string, unknown>;
    const status = record.status as GateStatus;
    if (!['passed', 'failed'].includes(status)) throw new LiveStoreError(`invalid_${field}_${key}_status`);
    const evidenceReference = cleanString(record.evidenceReference, `${field}_${key}_evidence`, 180);
    return { key, label: labels[key][0], labelAr: labels[key][1], status, evidenceReference };
  });
};

const normalizeProvenMoments = (value: unknown, completedAt: string): PropertyMoment[] => {
  if (!Array.isArray(value)) throw new LiveStoreError('invalid_proven_moments');
  if (value.length > MOMENT_KEYS.length) throw new LiveStoreError('invalid_proven_moments');
  const seen = new Set<string>();
  return value.map((item) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) throw new LiveStoreError('invalid_proven_moment');
    const record = item as Record<string, unknown>;
    const key = cleanString(record.key, 'moment_key', 64) as MomentKey;
    if (!MOMENT_KEYS.includes(key) || seen.has(key)) throw new LiveStoreError('invalid_or_duplicate_moment_key');
    seen.add(key);
    const evidenceId = cleanString(record.evidenceReference, 'moment_evidence_reference', 180);
    const labels = momentLabels[key];
    return {
      key,
      title: labels[0],
      titleAr: labels[1],
      summary: `${labels[0]} was independently proven during the physical assessment.`,
      summaryAr: `تم توثيق ${labels[1]} بشكل مستقل أثناء التقييم الميداني.`,
      evidenceId,
      provenAt: completedAt,
    };
  });
};

export async function submitPropertyAssessment(session: LiveSession, propertyId: string, input: Record<string, unknown>): Promise<Assessment> {
  const assessor = await requireCurrentPartner(session, 'assessor');
  const propertyStored = await getProperty(propertyId);
  if (propertyStored.data.supplyStage !== 'assessment_scheduled' || propertyStored.data.assessorPartnerId !== assessor.id) {
    throw new LiveStoreError('assigned_assessment_required', 403);
  }
  const id = assessmentId(propertyId);
  const assessmentStored = await getDocument<Assessment>('assessments', id);
  if (!assessmentStored || assessmentStored.data.assessorPartnerId !== assessor.id || assessmentStored.data.result !== 'scheduled') {
    throw new LiveStoreError('scheduled_assessment_record_required', 409);
  }
  if (input.independenceConfirmed !== true) throw new LiveStoreError('independence_confirmation_required');
  const completedAt = new Date().toISOString();
  const trustGates = normalizeFinalGates(input.trustGates, TRUST_GATE_KEYS, trustLabels, 'trust_gates');
  const shieldGates = normalizeFinalGates(input.shieldGates, SHIELD_GATE_KEYS, shieldLabels, 'shield_gates');
  const provenMoments = normalizeProvenMoments(input.provenMoments, completedAt);
  const evidenceReferences = [...new Set([
    ...trustGates.map((gate) => gate.evidenceReference || ''),
    ...shieldGates.map((gate) => gate.evidenceReference || ''),
    ...provenMoments.map((moment) => moment.evidenceId),
  ].filter(Boolean))];
  const recommendation = cleanString(input.recommendation, 'recommendation', 1000);
  const recommendationAr = optionalString(input.recommendationAr, 1000) || recommendation;
  const candidate: Assessment = {
    ...assessmentStored.data,
    updatedAt: completedAt,
    completedAt,
    independenceConfirmed: true,
    trustGates,
    shieldGates,
    provenMomentKeys: provenMoments.map((moment) => moment.key),
    evidenceCount: evidenceReferences.length,
    evidenceReferences,
    recommendation,
    recommendationAr,
    result: 'conditions',
  };
  const assessmentCheck = evaluateAssessment(candidate);
  const hasFailedGate = [...trustGates, ...shieldGates].some((gate) => gate.status === 'failed');
  const result: Assessment['result'] = assessmentCheck.passed ? 'passed' : hasFailedGate ? 'failed' : 'conditions';
  const assessment: Assessment = { ...candidate, result };
  const property: Property = {
    ...propertyStored.data,
    provenMoments,
    supplyStage: result === 'passed' ? 'decision_pending' : 'paused',
    updatedAt: completedAt,
  };
  await commitDocuments([
    { mode: 'replace', collection: 'assessments', id, data: assessment as unknown as Record<string, unknown>, expectedUpdateTime: assessmentStored.updateTime },
    { mode: 'replace', collection: 'properties', id: propertyId, data: property as unknown as Record<string, unknown>, expectedUpdateTime: propertyStored.updateTime },
  ]);
  return assessment;
}

export async function submitPropertyOwnerDecision(session: LiveSession, propertyId: string, input: Record<string, unknown>): Promise<OwnerDecision> {
  const owner = await requireCurrentPartner(session, 'owner');
  const propertyStored = await getProperty(propertyId);
  if (propertyStored.data.supplyStage !== 'decision_pending' || propertyStored.data.ownerPartnerId !== owner.id) {
    throw new LiveStoreError('assigned_owner_decision_required', 403);
  }
  const assessmentStored = await getDocument<Assessment>('assessments', assessmentId(propertyId));
  if (!assessmentStored || assessmentStored.data.result !== 'passed' || !evaluateAssessment(assessmentStored.data).passed) {
    throw new LiveStoreError('passed_assessment_required', 409);
  }
  const id = decisionId(propertyId);
  if (await getDocument<OwnerDecision>('ownerDecisions', id)) throw new LiveStoreError('owner_decision_already_recorded', 409);
  const decision = cleanString(input.decision, 'decision', 20) as OwnerDecision['decision'];
  if (!['go', 'defer', 'decline'].includes(decision)) throw new LiveStoreError('invalid_owner_decision');
  const decidedAt = new Date().toISOString();
  const note = optionalString(input.note, 1000);
  const noteAr = optionalString(input.noteAr, 1000) || note;
  const record: OwnerDecision = {
    id,
    dataMode: 'live',
    synthetic: false,
    createdAt: decidedAt,
    updatedAt: decidedAt,
    propertyId,
    ownerPartnerId: owner.id,
    decision,
    decidedAt,
    payoutReady: false,
    conditions: [],
    note,
    noteAr,
  };
  let property: Property = { ...propertyStored.data, updatedAt: decidedAt };

  if (decision === 'go') {
    const nightlyFloorEgp = Number(input.nightlyFloorEgp);
    if (!Number.isFinite(nightlyFloorEgp) || nightlyFloorEgp <= 0) throw new LiveStoreError('positive_owner_floor_required');
    if (input.payoutReady !== true) throw new LiveStoreError('payout_readiness_required');
    if (typeof input.communityApprovalRequired !== 'boolean') throw new LiveStoreError('community_policy_required');
    if (input.communityApprovalRequired && !property.communityAuthorityPartnerId) throw new LiveStoreError('named_community_authority_required', 409);
    record.nightlyFloorEgp = nightlyFloorEgp;
    record.payoutReady = true;
    property = {
      ...property,
      nightlyFloorEgp,
      payoutReady: true,
      communityApprovalRequired: input.communityApprovalRequired,
      supplyStage: 'activation_ready',
    };
  } else if (decision === 'defer') {
    property = { ...property, supplyStage: 'paused' };
  } else {
    property = { ...property, supplyStage: 'declined', joiningVisible: false, publiclyVisible: false, sealIssued: false };
  }

  await commitDocuments([
    { mode: 'create', collection: 'ownerDecisions', id, data: record as unknown as Record<string, unknown> },
    { mode: 'replace', collection: 'properties', id: propertyId, data: property as unknown as Record<string, unknown>, expectedUpdateTime: propertyStored.updateTime },
  ]);
  return record;
}

export async function activateLiveProperty(session: LiveSession, propertyId: string, input: Record<string, unknown>): Promise<Property> {
  const operator = await requireCurrentPartner(session, 'operator');
  const propertyStored = await getProperty(propertyId);
  if (propertyStored.data.supplyStage !== 'activation_ready' || propertyStored.data.operatorPartnerId !== operator.id) {
    throw new LiveStoreError('assigned_activation_required', 403);
  }
  const assessmentStored = await getDocument<Assessment>('assessments', assessmentId(propertyId));
  const decisionStored = await getDocument<OwnerDecision>('ownerDecisions', decisionId(propertyId));
  if (!assessmentStored || !decisionStored) throw new LiveStoreError('assessment_and_owner_decision_required', 409);
  if (input.activationChecklistComplete !== true) throw new LiveStoreError('activation_checklist_required');
  const calendarAuthority = cleanString(input.calendarAuthority, 'calendar_authority', 30) as Property['calendarAuthority'];
  if (!['little_hut', 'external'].includes(calendarAuthority)) throw new LiveStoreError('explicit_calendar_authority_required');
  const requestedBookingMode = cleanString(input.bookingMode, 'booking_mode', 20) as Property['bookingMode'];
  if (!['request', 'instant'].includes(requestedBookingMode)) throw new LiveStoreError('invalid_booking_mode');
  const maxGuests = requireInteger(input.maxGuests, 'max_guests', 1, 20);
  const bedroomCount = requireInteger(input.bedroomCount, 'bedroom_count', 0, 20);
  const heroImage = requireHttpsUrl(input.heroImage, 'hero_image');
  const galleryRaw = Array.isArray(input.galleryImages) ? input.galleryImages : [];
  if (galleryRaw.length > 12) throw new LiveStoreError('too_many_gallery_images');
  const galleryImages = galleryRaw.map((item) => requireHttpsUrl(item, 'gallery_image'));
  if (propertyStored.data.communityApprovalRequired && !propertyStored.data.communityAuthorityPartnerId) {
    throw new LiveStoreError('named_community_authority_required', 409);
  }
  const now = new Date().toISOString();
  const candidate: Property = {
    ...propertyStored.data,
    updatedAt: now,
    calendarAuthority,
    bookingMode: requestedBookingMode,
    activationChecklistComplete: true,
    maxGuests,
    bedroomCount,
    heroImage,
    galleryImages,
    summary: `An independently assessed Little Hut home in ${propertyStored.data.location}. See the proven Moments below.`,
    summaryAr: `بيت ليتل هت تم تقييمه بشكل مستقل في ${propertyStored.data.locationAr}. تظهر اللحظات الموثقة أدناه.`,
  };
  const resolvedMode = resolveBookingMode(candidate).mode as Property['bookingMode'];
  const ready: Property = { ...candidate, bookingMode: resolvedMode };
  const liveCheck = evaluateGoLive(ready, assessmentStored.data, decisionStored.data);
  if (!liveCheck.allowed) throw new LiveStoreError('go_live_gate_failed', 409);
  if (!ready.operatorPartnerId || ready.provenMoments.length < 2 || !ready.heroImage || ready.maxGuests < 1) {
    throw new LiveStoreError('go_live_operational_fields_incomplete', 409);
  }
  const live: Property = {
    ...ready,
    supplyStage: 'live',
    publiclyVisible: true,
    joiningVisible: false,
    sealIssued: true,
    updatedAt: now,
  };
  await commitDocuments([{ mode: 'replace', collection: 'properties', id: propertyId, data: live as unknown as Record<string, unknown>, expectedUpdateTime: propertyStored.updateTime }]);
  return live;
}
