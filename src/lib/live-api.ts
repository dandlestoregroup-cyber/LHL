import type { Enquiry, OperatingDataset, Partner, Property } from '../types';

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

export async function createLiveScoutProperty(input: { name: string; nameAr: string; location: string; locationAr: string }): Promise<{ property: Property; dataset: OperatingDataset }> {
  return request('/api/live/scout/properties', { method: 'POST', body: JSON.stringify(input) });
}

export async function createServerLiveEnquiry(input: Record<string, unknown>): Promise<Enquiry> {
  const result = await request<{ enquiry: Enquiry }>('/api/live/enquiries', { method: 'POST', body: JSON.stringify(input) });
  return result.enquiry;
}

export async function advanceServerLiveEnquiry(id: string, input: AdvanceLiveInput = {}): Promise<{ enquiry: Enquiry; dataset: OperatingDataset }> {
  return request(`/api/live/enquiries/${encodeURIComponent(id)}/advance`, { method: 'POST', body: JSON.stringify(input) });
}

export async function recordServerCommunityApproval(id: string, evidenceReference: string): Promise<{ enquiry: Enquiry; dataset: OperatingDataset }> {
  return request(`/api/live/enquiries/${encodeURIComponent(id)}/community-approval`, { method: 'POST', body: JSON.stringify({ evidenceReference }) });
}
