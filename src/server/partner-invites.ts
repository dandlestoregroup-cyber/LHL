import crypto from 'node:crypto';
import type { Partner, PartnerRole } from '../types';
import { createDocument, getDocument, listDocuments, replaceDocument } from './firestore-rest';
import { authenticatePassword, type LiveSession } from './session-auth';
import { LiveStoreError, sessionPartner } from './live-store';

export type PartnerInviteStatus = 'pending' | 'claiming' | 'accepted' | 'revoked';

export interface PartnerInvite {
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
  status: PartnerInviteStatus;
  createdByPartnerId: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  acceptedAt?: string;
  acceptedPartnerId?: string;
}

export interface PartnerInviteSummary extends Omit<PartnerInvite, 'id'> {
  id: string;
}

const INVITE_TTL_MS = 48 * 60 * 60 * 1000;
const ROLES = new Set<PartnerRole>(['owner', 'scout', 'operator', 'assessor', 'community_authority']);

const requireString = (value: unknown, field: string, max = 160): string => {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) {
    throw new LiveStoreError(`invalid_${field}`);
  }
  return value.trim();
};

const requireEmail = (value: unknown): string => {
  const email = requireString(value, 'email', 254).toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new LiveStoreError('invalid_email');
  return email;
};

export function hashInviteToken(token: string): string {
  return crypto.createHash('sha256').update(token, 'utf8').digest('hex');
}

export function inviteCanBeAccepted(invite: Pick<PartnerInvite, 'status' | 'expiresAt'>, now = new Date()): boolean {
  return invite.status === 'pending' && new Date(invite.expiresAt).getTime() > now.getTime();
}

const requirePlatformAdmin = async (session: LiveSession): Promise<Partner> => {
  const partner = await sessionPartner(session);
  if (!partner || partner.status !== 'active' || !partner.platformAdmin) {
    throw new LiveStoreError('platform_admin_required', 403);
  }
  return partner;
};

export async function issuePartnerInvite(session: LiveSession, input: Record<string, unknown>): Promise<{ invite: PartnerInviteSummary; token: string }> {
  const admin = await requirePlatformAdmin(session);
  const email = requireEmail(input.email);
  const role = requireString(input.role, 'role', 40) as PartnerRole;
  if (!ROLES.has(role)) throw new LiveStoreError('invalid_role');

  const now = new Date();
  const existingInvites = await listDocuments<PartnerInvite>('partnerInvites');
  const duplicate = existingInvites.some(({ data }) => data.email === email && inviteCanBeAccepted(data, now));
  if (duplicate) throw new LiveStoreError('pending_invite_exists', 409);

  const token = crypto.randomBytes(32).toString('base64url');
  const id = hashInviteToken(token);
  const createdAt = now.toISOString();
  const invite: PartnerInvite = {
    id,
    dataMode: 'live',
    synthetic: false,
    email,
    role,
    name: requireString(input.name, 'name', 120),
    nameAr: typeof input.nameAr === 'string' && input.nameAr.trim() ? input.nameAr.trim().slice(0, 120) : requireString(input.name, 'name', 120),
    organisation: typeof input.organisation === 'string' && input.organisation.trim() ? input.organisation.trim().slice(0, 160) : undefined,
    serviceArea: requireString(input.serviceArea, 'service_area', 120),
    serviceAreaAr: typeof input.serviceAreaAr === 'string' && input.serviceAreaAr.trim() ? input.serviceAreaAr.trim().slice(0, 120) : requireString(input.serviceArea, 'service_area', 120),
    status: 'pending',
    createdByPartnerId: admin.id,
    createdAt,
    updatedAt: createdAt,
    expiresAt: new Date(now.getTime() + INVITE_TTL_MS).toISOString(),
  };
  await createDocument('partnerInvites', id, invite as unknown as Record<string, unknown>);
  return { invite, token };
}

export async function listPartnerInvites(session: LiveSession): Promise<PartnerInviteSummary[]> {
  await requirePlatformAdmin(session);
  const invites = await listDocuments<PartnerInvite>('partnerInvites');
  return invites
    .map(({ data }) => data)
    .filter((invite) => invite.dataMode === 'live' && !invite.synthetic)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function revokePartnerInvite(session: LiveSession, id: string): Promise<PartnerInviteSummary> {
  await requirePlatformAdmin(session);
  const stored = await getDocument<PartnerInvite>('partnerInvites', id);
  if (!stored) throw new LiveStoreError('invite_not_found', 404);
  if (stored.data.status === 'accepted') throw new LiveStoreError('accepted_invite_cannot_be_revoked', 409);
  if (stored.data.status === 'revoked') return stored.data;
  const now = new Date().toISOString();
  const updated: PartnerInvite = { ...stored.data, status: 'revoked', updatedAt: now };
  await replaceDocument('partnerInvites', id, updated as unknown as Record<string, unknown>, stored.updateTime);
  return updated;
}

export async function acceptPartnerInvite(token: unknown, password: unknown): Promise<{ uid: string; email: string; partner: Partner }> {
  const rawToken = requireString(token, 'invite_token', 200);
  const id = hashInviteToken(rawToken);
  const stored = await getDocument<PartnerInvite>('partnerInvites', id);
  if (!stored || !inviteCanBeAccepted(stored.data)) throw new LiveStoreError('invite_invalid_or_expired', 410);

  const claimingAt = new Date().toISOString();
  const claiming: PartnerInvite = { ...stored.data, status: 'claiming', updatedAt: claimingAt };
  const claimed = await replaceDocument('partnerInvites', id, claiming as unknown as Record<string, unknown>, stored.updateTime)
    .catch((error) => {
      if (error instanceof Error && error.message === 'record_changed_concurrently') throw new LiveStoreError('invite_already_claimed', 409);
      throw error;
    });

  try {
    const identity = await authenticatePassword(stored.data.email, String(password || ''), true);
    const now = new Date().toISOString();
    const partner: Partner = {
      id: identity.uid,
      dataMode: 'live',
      synthetic: false,
      createdAt: now,
      updatedAt: now,
      role: stored.data.role,
      status: 'active',
      platformAdmin: false,
      name: stored.data.name,
      nameAr: stored.data.nameAr,
      organisation: stored.data.organisation,
      serviceArea: stored.data.serviceArea,
      serviceAreaAr: stored.data.serviceAreaAr,
    };
    await createDocument('partners', partner.id, partner as unknown as Record<string, unknown>);
    const accepted: PartnerInvite = {
      ...claiming,
      status: 'accepted',
      updatedAt: now,
      acceptedAt: now,
      acceptedPartnerId: partner.id,
    };
    await replaceDocument('partnerInvites', id, accepted as unknown as Record<string, unknown>, claimed.updateTime);
    return { uid: identity.uid, email: identity.email, partner };
  } catch (error) {
    const restored: PartnerInvite = { ...stored.data, status: 'pending', updatedAt: new Date().toISOString() };
    await replaceDocument('partnerInvites', id, restored as unknown as Record<string, unknown>, claimed.updateTime).catch(() => undefined);
    if (error instanceof LiveStoreError) throw error;
    const code = error instanceof Error ? error.message : 'invite_acceptance_failed';
    throw new LiveStoreError(code, 400);
  }
}
