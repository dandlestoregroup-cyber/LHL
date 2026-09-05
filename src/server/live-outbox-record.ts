import crypto from 'node:crypto';

export type BusinessCollection = 'properties' | 'assessments' | 'ownerDecisions' | 'enquiries';

export interface DerivedOutboxRecord {
  id: string;
  data: Record<string, unknown>;
}

const aggregateType: Record<BusinessCollection, string> = {
  properties: 'property',
  assessments: 'assessment',
  ownerDecisions: 'owner_decision',
  enquiries: 'enquiry',
};

export function isBusinessCollection(collection: string): collection is BusinessCollection {
  return ['properties', 'assessments', 'ownerDecisions', 'enquiries'].includes(collection);
}

const nestedField = (value: unknown, field: string): unknown =>
  typeof value === 'object' && value && !Array.isArray(value)
    ? (value as Record<string, unknown>)[field]
    : undefined;

const summarize = (collection: BusinessCollection, data: Record<string, unknown>): Record<string, unknown> => {
  if (collection === 'properties') {
    return {
      supplyStage: data.supplyStage,
      publiclyVisible: data.publiclyVisible === true,
      sealIssued: data.sealIssued === true,
      communityApprovalRequired: data.communityApprovalRequired === true,
      inventoryBaselineReady: Boolean(data.inventoryBaseline),
    };
  }
  if (collection === 'assessments') {
    return {
      propertyId: data.propertyId,
      result: data.result,
      evidenceCount: data.evidenceCount,
    };
  }
  if (collection === 'ownerDecisions') {
    return {
      propertyId: data.propertyId,
      decision: data.decision,
      payoutReady: data.payoutReady === true,
    };
  }
  const proofStay = typeof data.proofStay === 'object' && data.proofStay && !Array.isArray(data.proofStay)
    ? data.proofStay as Record<string, unknown>
    : undefined;
  return {
    propertyId: data.propertyId,
    stage: data.stage,
    communityApprovalStatus: nestedField(data.communityApproval, 'status'),
    readinessStatus: nestedField(data.readinessCheck, 'status'),
    preStayCaptured: Boolean(proofStay?.preStay),
    postStayCaptured: Boolean(proofStay?.postStay),
    proofStayStatus: nestedField(proofStay?.result, 'status'),
  };
};

export function deriveLiveOutboxRecord(
  operation: 'created' | 'replaced',
  collection: BusinessCollection,
  id: string,
  data: Record<string, unknown>,
): DerivedOutboxRecord | null {
  if (data.dataMode !== 'live' || data.synthetic !== false) return null;
  const occurredAt = typeof data.updatedAt === 'string'
    ? data.updatedAt
    : typeof data.createdAt === 'string'
      ? data.createdAt
      : null;
  if (!occurredAt) return null;

  const payload = summarize(collection, data);
  const fingerprint = JSON.stringify(payload);
  const eventId = `evt_${crypto.createHash('sha256').update(`${operation}\n${collection}\n${id}\n${occurredAt}\n${fingerprint}`).digest('hex')}`;
  return {
    id: eventId,
    data: {
      id: eventId,
      dataMode: 'live',
      synthetic: false,
      type: `record.${operation}`,
      aggregateType: aggregateType[collection],
      aggregateId: id,
      occurredAt,
      payload: {
        collection,
        operation,
        ...payload,
      },
      status: 'pending',
      attempts: 0,
    },
  };
}
