import type { DataMode, EnquiryStage } from '../types';

export type AutomationEventType =
  | 'enquiry.created'
  | 'enquiry.stage_changed'
  | 'community_approval.recorded'
  | 'scout_lead.created';

export interface AutomationEvent<TPayload extends Record<string, unknown> = Record<string, unknown>> {
  version: 1;
  id: string;
  type: AutomationEventType;
  source: 'lhl-web';
  dataMode: DataMode;
  synthetic: boolean;
  occurredAt: string;
  payload: TPayload;
}

interface EnquiryCreatedPayload extends Record<string, unknown> {
  enquiryId: string;
  propertyId: string;
  guestName: string;
  guestPhoneMasked: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  requestedMoment: string;
}

interface EnquiryStageChangedPayload extends Record<string, unknown> {
  enquiryId: string;
  propertyId: string;
  fromStage: EnquiryStage;
  toStage: EnquiryStage;
}

const createEventId = () => `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export function buildAutomationEvent<TPayload extends Record<string, unknown>>(
  type: AutomationEventType,
  dataMode: DataMode,
  payload: TPayload,
): AutomationEvent<TPayload> {
  return {
    version: 1,
    id: createEventId(),
    type,
    source: 'lhl-web',
    dataMode,
    synthetic: dataMode === 'demo',
    occurredAt: new Date().toISOString(),
    payload,
  };
}

async function postAutomationEvent(event: AutomationEvent): Promise<void> {
  const response = await fetch('/api/activepieces', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Automation gateway rejected ${event.type}: ${response.status}${detail ? ` ${detail}` : ''}`);
  }
}

export function publishAutomationEvent<TPayload extends Record<string, unknown>>(
  type: AutomationEventType,
  dataMode: DataMode,
  payload: TPayload,
): void {
  // Live mutations are still browser-local. Never let an unauthenticated browser
  // trigger real-world automation until Live persistence moves server-side.
  if (dataMode !== 'demo') return;

  const event = buildAutomationEvent(type, dataMode, payload);
  void postAutomationEvent(event).catch((error) => {
    console.warn('[LHL automation]', error);
  });
}

export const automationPayload = {
  enquiryCreated(input: EnquiryCreatedPayload): EnquiryCreatedPayload {
    return input;
  },
  enquiryStageChanged(input: EnquiryStageChangedPayload): EnquiryStageChangedPayload {
    return input;
  },
};
