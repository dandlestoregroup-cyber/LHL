import crypto from 'node:crypto';
import type {
  Enquiry,
  InventoryBaselineItem,
  InventoryCondition,
  ProofStayObservation,
  ProofStayResult,
  ProofStaySnapshot,
  Property,
  ReadinessCheckItem,
  ReadinessCheckKey,
  StayReadinessCheck,
} from '../types';
import { getDocument, listDocuments, replaceDocument } from './firestore-rest';
import type { LiveSession } from './session-auth';
import { LiveStoreError, sessionPartner } from './live-store';

const readinessKeys: ReadonlyArray<ReadinessCheckKey> = ['access', 'cleanliness', 'utilities', 'sleeping', 'safety', 'moment_setup'];

const cleanString = (value: unknown, field: string, max = 180): string => {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) throw new LiveStoreError(`invalid_${field}`);
  return value.trim();
};

const optionalString = (value: unknown, max = 1000): string =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

const requireInteger = (value: unknown, field: string, min: number, max: number): number => {
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) throw new LiveStoreError(`invalid_${field}`);
  return number;
};

const requireOperatorForProperty = async (session: LiveSession, property: Property) => {
  const operator = await sessionPartner(session);
  if (!operator || operator.status !== 'active' || operator.role !== 'operator') throw new LiveStoreError('operator_authority_required', 403);
  if (property.operatorPartnerId !== operator.id) throw new LiveStoreError('operator_not_assigned', 403);
  return operator;
};

const getLiveProperty = async (propertyId: string) => {
  const stored = await getDocument<Property>('properties', propertyId);
  if (!stored || stored.data.dataMode !== 'live' || stored.data.synthetic) throw new LiveStoreError('property_not_found', 404);
  return stored;
};

const getLiveEnquiry = async (enquiryId: string) => {
  const stored = await getDocument<Enquiry>('enquiries', enquiryId);
  if (!stored || stored.data.dataMode !== 'live' || stored.data.synthetic) throw new LiveStoreError('enquiry_not_found', 404);
  return stored;
};

const normalizeBaselineItems = (value: unknown): InventoryBaselineItem[] => {
  if (!Array.isArray(value) || value.length < 1 || value.length > 50) throw new LiveStoreError('invalid_inventory_items');
  const seen = new Set<string>();
  return value.map((raw, index) => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new LiveStoreError(`invalid_inventory_item_${index}`);
    const record = raw as Record<string, unknown>;
    const key = cleanString(record.key, `inventory_key_${index}`, 64).toLowerCase();
    if (!/^[a-z0-9][a-z0-9_-]{1,63}$/.test(key) || seen.has(key)) throw new LiveStoreError('invalid_or_duplicate_inventory_key');
    seen.add(key);
    const label = cleanString(record.label, `inventory_label_${index}`, 120);
    const labelAr = optionalString(record.labelAr, 120) || label;
    const expectedQuantity = requireInteger(record.expectedQuantity, `inventory_quantity_${index}`, 1, 100);
    const evidenceReference = cleanString(record.evidenceReference, `inventory_evidence_${index}`, 180);
    return { key, label, labelAr, expectedQuantity, evidenceReference };
  });
};

const normalizeReadinessItems = (value: unknown): ReadinessCheckItem[] => {
  if (!Array.isArray(value) || value.length !== readinessKeys.length) throw new LiveStoreError('invalid_readiness_items');
  const byKey = new Map<string, Record<string, unknown>>();
  for (const raw of value) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new LiveStoreError('invalid_readiness_item');
    const record = raw as Record<string, unknown>;
    const key = cleanString(record.key, 'readiness_key', 32) as ReadinessCheckKey;
    if (!readinessKeys.includes(key) || byKey.has(key)) throw new LiveStoreError('invalid_or_duplicate_readiness_key');
    byKey.set(key, record);
  }
  return readinessKeys.map((key) => {
    const record = byKey.get(key)!;
    const status = record.status;
    if (status !== 'passed' && status !== 'failed') throw new LiveStoreError(`invalid_readiness_${key}_status`);
    return {
      key,
      status,
      evidenceReference: cleanString(record.evidenceReference, `readiness_${key}_evidence`, 180),
    };
  });
};

const normalizeObservations = (value: unknown, baseline: InventoryBaselineItem[]): ProofStayObservation[] => {
  if (!Array.isArray(value) || value.length !== baseline.length) throw new LiveStoreError('inventory_snapshot_must_match_baseline');
  const expectedKeys = new Set(baseline.map((item) => item.key));
  const seen = new Set<string>();
  const observations = value.map((raw, index) => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new LiveStoreError(`invalid_inventory_observation_${index}`);
    const record = raw as Record<string, unknown>;
    const key = cleanString(record.key, `observation_key_${index}`, 64).toLowerCase();
    if (!expectedKeys.has(key) || seen.has(key)) throw new LiveStoreError('inventory_snapshot_must_match_baseline');
    seen.add(key);
    const observedQuantity = requireInteger(record.observedQuantity, `observed_quantity_${index}`, 0, 100);
    const condition = record.condition as InventoryCondition;
    if (!['good', 'attention', 'missing'].includes(condition)) throw new LiveStoreError(`invalid_inventory_condition_${index}`);
    if ((observedQuantity === 0 && condition !== 'missing') || (observedQuantity > 0 && condition === 'missing')) {
      throw new LiveStoreError(`inventory_quantity_condition_mismatch_${index}`);
    }
    return {
      key,
      observedQuantity,
      condition,
      evidenceReference: cleanString(record.evidenceReference, `observation_evidence_${index}`, 180),
    };
  });
  if (seen.size !== baseline.length) throw new LiveStoreError('inventory_snapshot_must_match_baseline');
  return observations;
};

export async function recordInventoryBaseline(
  session: LiveSession,
  propertyId: string,
  input: Record<string, unknown>,
): Promise<Property> {
  const propertyStored = await getLiveProperty(propertyId);
  const property = propertyStored.data;
  const operator = await requireOperatorForProperty(session, property);
  if (property.supplyStage !== 'live' || !property.sealIssued) throw new LiveStoreError('sealed_live_property_required', 409);

  const active = (await listDocuments<Enquiry>('enquiries'))
    .map((item) => item.data)
    .some((enquiry) => enquiry.dataMode === 'live' && !enquiry.synthetic && enquiry.propertyId === propertyId && Boolean(enquiry.proofStay?.preStay) && !enquiry.proofStay?.postStay);
  if (active) throw new LiveStoreError('inventory_baseline_locked_by_active_stay', 409);

  const items = normalizeBaselineItems(input.items);
  const capturedAt = new Date().toISOString();
  const updated: Property = {
    ...property,
    updatedAt: capturedAt,
    inventoryBaseline: {
      capturedAt,
      capturedByPartnerId: operator.id,
      items,
    },
  };
  await replaceDocument('properties', propertyId, updated as unknown as Record<string, unknown>, propertyStored.updateTime);
  return updated;
}

export async function recordStayReadiness(
  session: LiveSession,
  enquiryId: string,
  input: Record<string, unknown>,
): Promise<Enquiry> {
  const enquiryStored = await getLiveEnquiry(enquiryId);
  const enquiry = enquiryStored.data;
  const propertyStored = await getLiveProperty(enquiry.propertyId);
  const property = propertyStored.data;
  const operator = await requireOperatorForProperty(session, property);
  if (enquiry.stage !== 'confirmed') throw new LiveStoreError('confirmed_stay_required_for_readiness', 409);
  if (enquiry.proofStay?.preStay) throw new LiveStoreError('readiness_locked_after_pre_stay', 409);
  if (!property.inventoryBaseline?.items.length) throw new LiveStoreError('inventory_baseline_required', 409);

  const items = normalizeReadinessItems(input.items);
  const checkedAt = new Date().toISOString();
  const readinessCheck: StayReadinessCheck = {
    checkedAt,
    checkedByPartnerId: operator.id,
    baselineCapturedAt: property.inventoryBaseline.capturedAt,
    status: items.every((item) => item.status === 'passed') ? 'ready' : 'blocked',
    items,
    note: optionalString(input.note),
    noteAr: optionalString(input.noteAr),
  };
  const updated: Enquiry = { ...enquiry, updatedAt: checkedAt, readinessCheck };
  await replaceDocument('enquiries', enquiryId, updated as unknown as Record<string, unknown>, enquiryStored.updateTime);
  return updated;
}

export async function captureProofStaySnapshot(
  session: LiveSession,
  enquiryId: string,
  phase: 'pre_stay' | 'post_stay',
  input: Record<string, unknown>,
): Promise<Enquiry> {
  const enquiryStored = await getLiveEnquiry(enquiryId);
  const enquiry = enquiryStored.data;
  const propertyStored = await getLiveProperty(enquiry.propertyId);
  const property = propertyStored.data;
  const operator = await requireOperatorForProperty(session, property);
  const baseline = property.inventoryBaseline;
  if (!baseline?.items.length) throw new LiveStoreError('inventory_baseline_required', 409);

  const capturedAt = new Date().toISOString();
  const observations = normalizeObservations(input.observations, baseline.items);

  if (phase === 'pre_stay') {
    if (enquiry.stage !== 'confirmed') throw new LiveStoreError('confirmed_stay_required_for_pre_snapshot', 409);
    if (enquiry.proofStay?.preStay) throw new LiveStoreError('proofstay_pre_already_captured', 409);
    if (enquiry.readinessCheck?.status !== 'ready') throw new LiveStoreError('ready_check_required_before_pre_snapshot', 409);
    if (enquiry.readinessCheck.baselineCapturedAt !== baseline.capturedAt) throw new LiveStoreError('readiness_baseline_is_stale', 409);
    const baselineByKey = new Map(baseline.items.map((item) => [item.key, item]));
    const preReady = observations.every((observation) => {
      const expected = baselineByKey.get(observation.key)!;
      return observation.condition === 'good' && observation.observedQuantity === expected.expectedQuantity;
    });
    if (!preReady) throw new LiveStoreError('pre_stay_inventory_not_ready', 409);

    const snapshot: ProofStaySnapshot = {
      id: `proofstay-pre-${crypto.randomUUID()}`,
      phase,
      capturedAt,
      capturedByPartnerId: operator.id,
      baselineCapturedAt: baseline.capturedAt,
      observations,
    };
    const updated: Enquiry = {
      ...enquiry,
      updatedAt: capturedAt,
      proofStay: { ...(enquiry.proofStay || {}), preStay: snapshot },
    };
    await replaceDocument('enquiries', enquiryId, updated as unknown as Record<string, unknown>, enquiryStored.updateTime);
    return updated;
  }

  if (enquiry.stage !== 'completed') throw new LiveStoreError('completed_stay_required_for_post_snapshot', 409);
  if (!enquiry.proofStay?.preStay) throw new LiveStoreError('proofstay_pre_required', 409);
  if (enquiry.proofStay.postStay) throw new LiveStoreError('proofstay_post_already_captured', 409);
  const pre = enquiry.proofStay.preStay;
  if (pre.baselineCapturedAt !== baseline.capturedAt) throw new LiveStoreError('proofstay_baseline_changed_before_post', 409);
  const preByKey = new Map(pre.observations.map((observation) => [observation.key, observation]));
  const changedKeys = observations
    .filter((observation) => {
      const before = preByKey.get(observation.key);
      return !before || before.observedQuantity !== observation.observedQuantity || observation.condition !== 'good';
    })
    .map((observation) => observation.key);
  const postStay: ProofStaySnapshot = {
    id: `proofstay-post-${crypto.randomUUID()}`,
    phase,
    capturedAt,
    capturedByPartnerId: operator.id,
    baselineCapturedAt: pre.baselineCapturedAt,
    observations,
  };
  const result: ProofStayResult = {
    status: changedKeys.length === 0 ? 'verified_unchanged' : 'attention_required',
    comparedAt: capturedAt,
    preSnapshotId: pre.id,
    postSnapshotId: postStay.id,
    changedKeys,
  };
  const updated: Enquiry = {
    ...enquiry,
    updatedAt: capturedAt,
    proofStay: { ...enquiry.proofStay, postStay, result },
  };
  await replaceDocument('enquiries', enquiryId, updated as unknown as Record<string, unknown>, enquiryStored.updateTime);
  return updated;
}
