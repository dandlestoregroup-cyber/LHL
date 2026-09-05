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

const summarize = (collection: BusinessCollection, data: Record<string, unknown>): Record<string, unknown> => {
  if (collection === 'properties') {
    return {
      supplyStage: data.supplyStage,
      publiclyVisible: data.publiclyVisible === true,
      sealIssued: data.sealIssued === true,
      communityApprovalRequired: data.communityApprovalRequired === true,
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
  return {
    propertyId: data.propertyId,
    stage: data.stage,
    communityApprovalStatus: typeof data.communityApproval === 'object' && data.communityApproval
      ? (data.communityApproval as Record<string, unknown>).status
      : undefined,
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
