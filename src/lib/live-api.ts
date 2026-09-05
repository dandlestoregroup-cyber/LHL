import type { Assessment, Enquiry, GateStatus, MomentKey, OperatingDataset, OwnerDecision, Partner, PartnerRole, Property } from '../types';

export interface LiveAuthState {
  authenticated: boolean;
  email?: string;
  partner: Partner | null;
}

export interface AdvanceLiveInput {
  nightlyRateEgp?: number;
  paymentReference?: string;
  paymentAmountEgp?: number;
}

export interface LivePartnerInvite {
  id: string;
  dataMode: 'live';
  synthetic: false;
  email: string;
  role: PartnerRole;
  name: string;
  nameAr: string;
  organisation?: string;
  serviceArea: string;
  serviceAreaAr: string;
  status: 'pending' | 'claiming' | 'accepted' | 'revoked';
  createdByPartnerId: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  acceptedAt?: string;
  acceptedPartnerId?: string;
}

export interface IssuePartnerInviteInput {
  email: string;
  role: PartnerRole;
  name: string;
  nameAr: string;
  organisation?: string;
  serviceArea: string;
  serviceAreaAr: string;
}

export interface AssessmentFindingInput {
  status: Exclude<GateStatus, 'pending'>;
  evidenceReference: string;
}

export interface SubmitAssessmentInput {
  independenceConfirmed: true;
  trustGates: Record<string, AssessmentFindingInput>;
  shieldGates: Record<string, AssessmentFindingInput>;
  provenMoments: Array<{ key: MomentKey; evidenceReference: string }>;
  recommendation: string;
  recommendationAr: string;
}

export interface OwnerDecisionInput {
  decision: OwnerDecision['decision'];
  nightlyFloorEgp?: number;
  payoutReady?: boolean;
  communityApprovalRequired?: boolean;
  note?: string;
  noteAr?: string;
}

export interface ActivatePropertyInput {
  activationChecklistComplete: true;
  calendarAuthority: 'little_hut' | 'external';
  bookingMode: 'request' | 'instant';
  maxGuests: number;
  bedroomCount: number;
  heroImage: string;
  galleryImages: string[];
}

export class LiveApiError extends Error {
  constructor(public readonly code: string, public readonly status: number) {
    super(code);
    this.name = 'LiveApiError';
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      ...(init.body ? { 'content-type': 'application/json' } : {}),
      ...(init.headers || {}),
    },
  });
  if (!response.ok) {
    let code = `request_failed_${response.status}`;
    try {
      const body = await response.json() as { error?: string };
      if (body.error) code = body.error;
    } catch {
      // Keep the status-derived code when the server did not return JSON.
    }
    throw new LiveApiError(code, response.status);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function getLiveAuth(): Promise<LiveAuthState> {
  return request<LiveAuthState>('/api/auth/me');
}

export async function signInLive(email: string, password: string): Promise<LiveAuthState> {
  return request<LiveAuthState>('/api/auth/sign-in', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export async function signUpLive(email: string, password: string): Promise<LiveAuthState> {
  return request<LiveAuthState>('/api/auth/sign-up', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export async function acceptLiveInvite(token: string, password: string): Promise<LiveAuthState> {
  return request<LiveAuthState>('/api/auth/accept-invite', { method: 'POST', body: JSON.stringify({ token, password }) });
}

export async function signOutLive(): Promise<void> {
  await request<void>('/api/auth/sign-out', { method: 'POST' });
}

export async function fetchLiveDataset(): Promise<OperatingDataset> {
  const result = await request<{ dataset: OperatingDataset }>('/api/live/dataset');
  return result.dataset;
}

export async function bootstrapLiveScout(input: { name: string; nameAr: string; organisation?: string; serviceArea: string; serviceAreaAr: string }): Promise<{ partner: Partner; dataset: OperatingDataset }> {
  return request('/api/live/bootstrap/scout', { method: 'POST', body: JSON.stringify(input) });
}

export async function listLivePartnerInvites(): Promise<LivePartnerInvite[]> {
  const result = await request<{ invites: LivePartnerInvite[] }>('/api/live/invites');
  return result.invites;
}

export async function issueLivePartnerInvite(input: IssuePartnerInviteInput): Promise<{ invite: LivePartnerInvite; inviteUrl: string }> {
  return request('/api/live/invites', { method: 'POST', body: JSON.stringify(input) });
}

export async function revokeLivePartnerInvite(id: string): Promise<LivePartnerInvite> {
  const result = await request<{ invite: LivePartnerInvite }>(`/api/live/invites/${encodeURIComponent(id)}/revoke`, { method: 'POST' });
  return result.invite;
}

export async function createLiveScoutProperty(input: { name: string; nameAr: string; location: string; locationAr: string }): Promise<{ property: Property; dataset: OperatingDataset }> {
  return request('/api/live/scout/properties', { method: 'POST', body: JSON.stringify(input) });
}

export async function assignLiveOwner(propertyId: string, ownerPartnerId: string, ownerConsentReference: string): Promise<{ property: Property; dataset: OperatingDataset }> {
  return request(`/api/live/properties/${encodeURIComponent(propertyId)}/assign-owner`, { method: 'POST', body: JSON.stringify({ ownerPartnerId, ownerConsentReference }) });
}

export async function assignLiveOperator(propertyId: string, operatorPartnerId: string): Promise<{ property: Property; dataset: OperatingDataset }> {
  return request(`/api/live/properties/${encodeURIComponent(propertyId)}/assign-operator`, { method: 'POST', body: JSON.stringify({ operatorPartnerId }) });
}

export async function assignLiveCommunityAuthority(propertyId: string, communityAuthorityPartnerId: string): Promise<{ property: Property; dataset: OperatingDataset }> {
  return request(`/api/live/properties/${encodeURIComponent(propertyId)}/assign-community-authority`, { method: 'POST', body: JSON.stringify({ communityAuthorityPartnerId }) });
}

export async function scheduleLiveAssessment(propertyId: string, assessorPartnerId: string, scheduledFor: string): Promise<{ assessment: Assessment; dataset: OperatingDataset }> {
  return request(`/api/live/properties/${encodeURIComponent(propertyId)}/schedule-assessment`, { method: 'POST', body: JSON.stringify({ assessorPartnerId, scheduledFor }) });
}

export async function submitLiveAssessment(propertyId: string, input: SubmitAssessmentInput): Promise<{ assessment: Assessment; dataset: OperatingDataset }> {
  return request(`/api/live/properties/${encodeURIComponent(propertyId)}/assessment`, { method: 'POST', body: JSON.stringify(input) });
}

export async function submitLiveOwnerDecision(propertyId: string, input: OwnerDecisionInput): Promise<{ decision: OwnerDecision; dataset: OperatingDataset }> {
  return request(`/api/live/properties/${encodeURIComponent(propertyId)}/owner-decision`, { method: 'POST', body: JSON.stringify(input) });
}

export async function activateServerLiveProperty(propertyId: string, input: ActivatePropertyInput): Promise<{ property: Property; dataset: OperatingDataset }> {
  return request(`/api/live/properties/${encodeURIComponent(propertyId)}/activate`, { method: 'POST', body: JSON.stringify(input) });
}

export async function createServerLiveEnquiry(input: object): Promise<Enquiry> {
  const result = await request<{ enquiry: Enquiry }>('/api/live/enquiries', { method: 'POST', body: JSON.stringify(input) });
  return result.enquiry;
}

export async function advanceServerLiveEnquiry(id: string, input: AdvanceLiveInput = {}): Promise<{ enquiry: Enquiry; dataset: OperatingDataset }> {
  return request(`/api/live/enquiries/${encodeURIComponent(id)}/advance`, { method: 'POST', body: JSON.stringify(input) });
}

export async function recordServerCommunityApproval(id: string, evidenceReference: string): Promise<{ enquiry: Enquiry; dataset: OperatingDataset }> {
  return request(`/api/live/enquiries/${encodeURIComponent(id)}/community-approval`, { method: 'POST', body: JSON.stringify({ evidenceReference }) });
}
