import type { Property } from '../types';
import { commitDocuments, getDocument } from './firestore-rest';
import type { LiveSession } from './session-auth';
import { LiveStoreError, sessionPartner } from './live-store';

const cleanString = (value: unknown, field: string, max = 180): string => {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) {
    throw new LiveStoreError(`invalid_${field}`);
  }
  return value.trim();
};

export async function recordScoutOwnerConsent(
  session: LiveSession,
  propertyId: string,
  input: Record<string, unknown>,
): Promise<Property> {
  const scout = await sessionPartner(session);
  if (!scout || scout.status !== 'active' || scout.role !== 'scout') {
    throw new LiveStoreError('scout_authority_required', 403);
  }

  const propertyStored = await getDocument<Property>('properties', propertyId);
  if (!propertyStored || propertyStored.data.dataMode !== 'live' || propertyStored.data.synthetic) {
    throw new LiveStoreError('property_not_found', 404);
  }
  if (propertyStored.data.supplyStage !== 'sourced' || propertyStored.data.scoutPartnerId !== scout.id) {
    throw new LiveStoreError('source_scout_consent_required', 403);
  }
  if (propertyStored.data.ownerConsentReference) {
    throw new LiveStoreError('owner_consent_already_recorded', 409);
  }

  const ownerConsentReference = cleanString(input.ownerConsentReference, 'owner_consent_reference', 180);
  const property: Property = {
    ...propertyStored.data,
    ownerConsentReference,
    updatedAt: new Date().toISOString(),
  };

  await commitDocuments([{
    mode: 'replace',
    collection: 'properties',
    id: propertyId,
    data: property as unknown as Record<string, unknown>,
    expectedUpdateTime: propertyStored.updateTime,
  }]);
  return property;
}
