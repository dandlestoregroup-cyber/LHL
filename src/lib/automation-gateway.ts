import crypto from 'node:crypto';
import { DEMO_ENQUIRIES, DEMO_PARTNERS, DEMO_PROPERTIES } from '../data/demo';
import type { EnquiryStage } from '../types';
import type { AutomationEvent, AutomationIngress, AutomationEventType } from './automation';

export class AutomationIngressError extends Error {
  constructor(public readonly code: string, public readonly status = 400) {
    super(code);
    this.name = 'AutomationIngressError';
  }
}

interface EnquiryState {
  propertyId: string;
  stage: EnquiryStage;
}

export interface PreparedAutomationEvent {
  event: AutomationEvent;
  commit: () => void;
}

const allowedTypes = new Set<AutomationEventType>([
  'enquiry.created',
  'enquiry.stage_changed',
  'community_approval.recorded',
  'scout_lead.created',
]);

const allowedTransitions: Partial<Record<EnquiryStage, EnquiryStage[]>> = {
  received: ['qualified'],
  qualified: ['availability_checked'],
  availability_checked: ['quoted'],
  quoted: ['hold'],
  hold: ['payment_pending', 'expired'],
  payment_pending: ['payment_received'],
  community_approved: ['confirmed'],
  confirmed: ['completed'],
};

const momentKeys = new Set([
  'slow_morning',
  'long_table',
  'afternoon_drift',
  'night_swim',
  'fire_conversation',
  'silent_reading',
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const requireString = (value: unknown, field: string, max = 200): string => {
  if (typeof value !== 'string' || value.trim().length === 0 || value.length > max) {
    throw new AutomationIngressError(`invalid_${field}`);
  }
  return value.trim();
};

const requireInteger = (value: unknown, field: string, min: number, max: number): number => {
  if (!Number.isInteger(value) || Number(value) < min || Number(value) > max) {
    throw new AutomationIngressError(`invalid_${field}`);
  }
  return Number(value);
};

const requireDemoIngress = (input: unknown): AutomationIngress => {
  if (!isRecord(input) || input.dataMode !== 'demo' || typeof input.type !== 'string' || !allowedTypes.has(input.type as AutomationEventType) || !isRecord(input.payload)) {
    throw new AutomationIngressError('invalid_or_live_event');
  }
  return input as unknown as AutomationIngress;
};

export function createDemoAutomationGuard() {
  const properties = new Map(DEMO_PROPERTIES.map((property) => [property.id, property]));
  const enquiries = new Map<string, EnquiryState>(
    DEMO_ENQUIRIES.map((enquiry) => [enquiry.id, { propertyId: enquiry.propertyId, stage: enquiry.stage }]),
  );
  const activeScoutIds = new Set(
    DEMO_PARTNERS.filter((partner) => partner.role === 'scout' && partner.status === 'active').map((partner) => partner.id),
  );
  const dynamicPropertyIds = new Set<string>();

  const normalizeEvent = (type: AutomationEventType, payload: Record<string, unknown>, now: Date): AutomationEvent => ({
    version: 1,
    id: `evt_${crypto.randomUUID()}`,
    type,
    source: 'lhl-web',
    dataMode: 'demo',
    synthetic: true,
    occurredAt: now.toISOString(),
    payload,
  });

  return {
    prepare(input: unknown, now = new Date()): PreparedAutomationEvent {
      const ingress = requireDemoIngress(input);
      const payload = ingress.payload;

      if (ingress.type === 'enquiry.created') {
        const enquiryId = requireString(payload.enquiryId, 'enquiry_id', 100);
        const propertyId = requireString(payload.propertyId, 'property_id', 100);
        const property = properties.get(propertyId);
        if (!property || property.supplyStage !== 'live' || !property.publiclyVisible || !property.sealIssued) {
          throw new AutomationIngressError('untrusted_demo_property', 403);
        }
        if (!/^demo-enquiry-\d+$/.test(enquiryId) || enquiries.has(enquiryId)) {
          throw new AutomationIngressError('invalid_or_duplicate_enquiry_id');
        }
        const guestName = requireString(payload.guestName, 'guest_name', 120);
        const guestPhoneMasked = requireString(payload.guestPhoneMasked, 'guest_phone_masked', 64);
        const checkIn = requireString(payload.checkIn, 'check_in', 10);
        const checkOut = requireString(payload.checkOut, 'check_out', 10);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut) || new Date(`${checkIn}T00:00:00Z`) >= new Date(`${checkOut}T00:00:00Z`)) {
          throw new AutomationIngressError('invalid_stay_dates');
        }
        const adults = requireInteger(payload.adults, 'adults', 1, 20);
        const children = requireInteger(payload.children, 'children', 0, 20);
        const requestedMoment = requireString(payload.requestedMoment, 'requested_moment', 64);
        if (!momentKeys.has(requestedMoment)) throw new AutomationIngressError('invalid_requested_moment');

        const trustedPayload = { enquiryId, propertyId, guestName, guestPhoneMasked, checkIn, checkOut, adults, children, requestedMoment };
        return {
          event: normalizeEvent(ingress.type, trustedPayload, now),
          commit: () => enquiries.set(enquiryId, { propertyId, stage: 'received' }),
        };
      }

      if (ingress.type === 'enquiry.stage_changed') {
        const enquiryId = requireString(payload.enquiryId, 'enquiry_id', 100);
        const propertyId = requireString(payload.propertyId, 'property_id', 100);
        const fromStage = requireString(payload.fromStage, 'from_stage', 64) as EnquiryStage;
        const toStage = requireString(payload.toStage, 'to_stage', 64) as EnquiryStage;
        const current = enquiries.get(enquiryId);
        if (!current || current.propertyId !== propertyId || current.stage !== fromStage) {
          throw new AutomationIngressError('untrusted_enquiry_state', 409);
        }

        let allowed = allowedTransitions[fromStage] || [];
        if (fromStage === 'payment_received') {
          const property = properties.get(propertyId);
          allowed = [property?.communityApprovalRequired ? 'community_approval_pending' : 'confirmed'];
        }
        if (!allowed.includes(toStage)) throw new AutomationIngressError('invalid_enquiry_transition', 409);

        const trustedPayload = { enquiryId, propertyId, fromStage, toStage };
        return {
          event: normalizeEvent(ingress.type, trustedPayload, now),
          commit: () => enquiries.set(enquiryId, { propertyId, stage: toStage }),
        };
      }

      if (ingress.type === 'community_approval.recorded') {
        const enquiryId = requireString(payload.enquiryId, 'enquiry_id', 100);
        const propertyId = requireString(payload.propertyId, 'property_id', 100);
        const authorityPartnerId = requireString(payload.authorityPartnerId, 'authority_partner_id', 100);
        const evidenceReference = requireString(payload.evidenceReference, 'evidence_reference', 120);
        const current = enquiries.get(enquiryId);
        const property = properties.get(propertyId);
        if (!current || current.propertyId !== propertyId || current.stage !== 'community_approval_pending') {
          throw new AutomationIngressError('untrusted_enquiry_state', 409);
        }
        if (!property?.communityApprovalRequired || property.communityAuthorityPartnerId !== authorityPartnerId) {
          throw new AutomationIngressError('untrusted_community_authority', 403);
        }
        if (!/^DEMO-(COMMUNITY|AZHA)-[A-Za-z0-9_-]+$/.test(evidenceReference)) {
          throw new AutomationIngressError('invalid_community_evidence');
        }

        const trustedPayload = { enquiryId, propertyId, authorityPartnerId, evidenceReference };
        return {
          event: normalizeEvent(ingress.type, trustedPayload, now),
          commit: () => enquiries.set(enquiryId, { propertyId, stage: 'community_approved' }),
        };
      }

      const propertyId = requireString(payload.propertyId, 'property_id', 100);
      const scoutPartnerId = requireString(payload.scoutPartnerId, 'scout_partner_id', 100);
      const name = requireString(payload.name, 'name', 120);
      const location = requireString(payload.location, 'location', 120);
      if (!/^demo-property-\d+$/.test(propertyId) || properties.has(propertyId) || dynamicPropertyIds.has(propertyId)) {
        throw new AutomationIngressError('invalid_or_duplicate_property_id');
      }
      if (!activeScoutIds.has(scoutPartnerId)) throw new AutomationIngressError('untrusted_scout', 403);

      const trustedPayload = { propertyId, scoutPartnerId, name, location };
      return {
        event: normalizeEvent('scout_lead.created', trustedPayload, now),
        commit: () => dynamicPropertyIds.add(propertyId),
      };
    },
  };
}

export function createFixedWindowRateLimiter(limit = 30, windowMs = 60_000) {
  const buckets = new Map<string, { count: number; resetAt: number }>();

  return {
    allow(key: string, now = Date.now()): boolean {
      const current = buckets.get(key);
      if (!current || now >= current.resetAt) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return true;
      }
      if (current.count >= limit) return false;
      current.count += 1;
      if (buckets.size > 10_000) {
        for (const [bucketKey, bucket] of buckets) {
          if (now >= bucket.resetAt) buckets.delete(bucketKey);
        }
      }
      return true;
    },
  };
}
